import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { ProductoDeLaVenta } from '../producto-de-la-venta/entities/producto-de-la-venta.entity';
import { Producto } from '../productos/entities/producto.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { TipoDeVenta } from '../tipo-de-venta/entities/tipo-de-venta.entity';
import { TipoDePago } from '../tipo-de-pago/entities/tipo-de-pago.entity';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,
    @InjectRepository(ProductoDeLaVenta)
    private readonly productoDeLaVentaRepository: Repository<ProductoDeLaVenta>,
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(TipoDeVenta)
    private readonly tipoDeVentaRepository: Repository<TipoDeVenta>,
    @InjectRepository(TipoDePago)
    private readonly tipoDePagoRepository: Repository<TipoDePago>,
  ) {}

  /** Cuenta cuántas unidades se venden por producto (producto_ids puede repetir id por cantidad) */
  private contarUnidadesPorProducto(productoIds: number[]): Map<number, number> {
    const map = new Map<number, number>();
    for (const id of productoIds) {
      map.set(id, (map.get(id) ?? 0) + 1);
    }
    return map;
  }

  /** Descuenta stock; lanza BadRequestException si no hay suficiente. */
  private async descontarStock(productoIds: number[]): Promise<void> {
    if (!productoIds?.length) return;
    const unidadesPorProducto = this.contarUnidadesPorProducto(productoIds);
    for (const [productoId, cantidadVendida] of unidadesPorProducto) {
      const producto = await this.productoRepository.findOne({
        where: { id: productoId },
      });
      if (!producto) {
        throw new BadRequestException(`Producto con id ${productoId} no encontrado`);
      }
      if (producto.activo === false) {
        throw new BadRequestException(`El producto "${producto.nombre}" está deshabilitado y no puede venderse`);
      }
      const cantidadActual = producto.cantidad ?? 0;
      if (cantidadActual < cantidadVendida) {
        throw new BadRequestException(
          `Stock insuficiente de "${producto.nombre}". Hay ${cantidadActual}, se requieren ${cantidadVendida}`,
        );
      }
      await this.productoRepository.update(productoId, {
        cantidad: cantidadActual - cantidadVendida,
      });
    }
  }

  /** Restaura stock (al eliminar o al quitar productos de una venta). */
  private async restaurarStock(productoIds: number[]): Promise<void> {
    if (!productoIds?.length) return;
    const unidadesPorProducto = this.contarUnidadesPorProducto(productoIds);
    for (const [productoId, cantidad] of unidadesPorProducto) {
      await this.productoRepository.increment(
        { id: productoId },
        'cantidad',
        cantidad,
      );
    }
  }

  async create(createVentaDto: CreateVentaDto): Promise<Venta> {
    const tipoVenta = await this.tipoDeVentaRepository.findOne({
      where: { id: createVentaDto.tipo_de_venta_id },
    });
    const descripcionTipo = (tipoVenta?.descripcion ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const esCredito = descripcionTipo.includes('credito');
    if (esCredito && (createVentaDto.cliente_id == null || createVentaDto.cliente_id === undefined)) {
      throw new BadRequestException('Para venta a crédito debe seleccionar un cliente');
    }

    const tipoDePagoId = createVentaDto.tipo_de_pago_id ?? 1;
    const clienteId = createVentaDto.cliente_id ?? null;

    let valorTotal: number;
    let lineasParaGuardar: { productoId: number; cantidad: number; precioUnitario: number | null }[] = [];

    if (createVentaDto.productos?.length) {
      const productos = createVentaDto.productos;
      const productoIds = productos.flatMap((p) => Array(p.cantidad).fill(p.producto_id));
      await this.descontarStock(productoIds);

      for (const item of productos) {
        const producto = await this.productoRepository.findOne({ where: { id: item.producto_id } });
        if (!producto) throw new BadRequestException(`Producto con id ${item.producto_id} no encontrado`);
        const precioUnitario = item.precio_unitario ?? producto.precioDeVenta;
        lineasParaGuardar.push({
          productoId: item.producto_id,
          cantidad: item.cantidad,
          precioUnitario,
        });
      }
      valorTotal = lineasParaGuardar.reduce(
        (sum, l) => sum + l.cantidad * (l.precioUnitario ?? 0),
        0,
      );
    } else {
      const productoIds = createVentaDto.producto_ids ?? [];
      await this.descontarStock(productoIds);
      valorTotal = createVentaDto.valor_total;
      for (const productoId of productoIds) {
        lineasParaGuardar.push({ productoId, cantidad: 1, precioUnitario: null });
      }
    }

    const venta = this.ventaRepository.create({
      valorTotal,
      tipoDeVentaId: createVentaDto.tipo_de_venta_id,
      tipoDePagoId,
      clienteId,
    });
    const ventaGuardada = await this.ventaRepository.save(venta);

    if (lineasParaGuardar.length) {
      const productosDeLaVenta = lineasParaGuardar.map((l) =>
        this.productoDeLaVentaRepository.create({
          ventaId: ventaGuardada.id,
          productoId: l.productoId,
          cantidad: l.cantidad,
          precioUnitario: l.precioUnitario,
        }),
      );
      await this.productoDeLaVentaRepository.save(productosDeLaVenta);
    }

    if (esCredito && clienteId != null) {
      const cliente = await this.clienteRepository.findOne({
        where: { id: clienteId },
      });
      if (cliente) {
        const nuevaDeuda = (cliente.deuda ?? 0) + valorTotal;
        await this.clienteRepository.update(clienteId, { deuda: nuevaDeuda });
      }
    }

    return this.findOne(ventaGuardada.id);
  }

  async findAll(): Promise<Venta[]> {
    return this.ventaRepository.find({
      relations: ['cliente', 'tipoDeVenta', 'tipoDePago', 'productosDeLaVenta', 'productosDeLaVenta.producto'],
    });
  }

  async findOne(id: number): Promise<Venta> {
    const venta = await this.ventaRepository.findOne({
      where: { id },
      relations: ['cliente', 'tipoDeVenta', 'tipoDePago', 'productosDeLaVenta', 'productosDeLaVenta.producto'],
    });
    if (!venta) {
      throw new NotFoundException(`Venta con id ${id} no encontrada`);
    }
    return venta;
  }

  async update(id: number, updateVentaDto: UpdateVentaDto): Promise<Venta> {
    const ventaActual = await this.findOne(id);

    if (updateVentaDto.producto_ids !== undefined) {
      const idsAntiguos =
        ventaActual.productosDeLaVenta?.flatMap((pv) =>
          Array(pv.cantidad ?? 1).fill(pv.productoId),
        ) ?? [];
      await this.restaurarStock(idsAntiguos);
      await this.descontarStock(updateVentaDto.producto_ids);

      await this.productoDeLaVentaRepository.delete({ ventaId: id });
      if (updateVentaDto.producto_ids.length > 0) {
        const productosDeLaVenta = updateVentaDto.producto_ids.map(
          (productoId) =>
            this.productoDeLaVentaRepository.create({
              ventaId: id,
              productoId,
            }),
        );
        await this.productoDeLaVentaRepository.save(productosDeLaVenta);
      }
    }

    await this.ventaRepository.update(id, {
      ...(updateVentaDto.valor_total !== undefined && {
        valorTotal: updateVentaDto.valor_total,
      }),
      ...(updateVentaDto.tipo_de_venta_id !== undefined && {
        tipoDeVentaId: updateVentaDto.tipo_de_venta_id,
      }),
      ...(updateVentaDto.tipo_de_pago_id !== undefined && {
        tipoDePagoId: updateVentaDto.tipo_de_pago_id,
      }),
      ...(updateVentaDto.cliente_id !== undefined && {
        clienteId: updateVentaDto.cliente_id,
      }),
    });

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const venta = await this.findOne(id);
    const productoIds =
      venta.productosDeLaVenta?.flatMap((pv) =>
        Array(pv.cantidad ?? 1).fill(pv.productoId),
      ) ?? [];
    await this.restaurarStock(productoIds);
    await this.productoDeLaVentaRepository.delete({ ventaId: id });
    await this.ventaRepository.delete(id);
  }
}
