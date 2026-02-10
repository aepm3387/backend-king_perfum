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
    const productoIds = createVentaDto.producto_ids ?? [];
    await this.descontarStock(productoIds);

    const tipoDePagoId = createVentaDto.tipo_de_pago_id ?? 1;

    const venta = this.ventaRepository.create({
      valorTotal: createVentaDto.valor_total,
      tipoDeVentaId: createVentaDto.tipo_de_venta_id,
      tipoDePagoId,
      clienteId: createVentaDto.cliente_id,
    });
    const ventaGuardada = await this.ventaRepository.save(venta);

    if (productoIds.length) {
      const productosDeLaVenta = productoIds.map((productoId) =>
        this.productoDeLaVentaRepository.create({
          ventaId: ventaGuardada.id,
          productoId,
        }),
      );
      await this.productoDeLaVentaRepository.save(productosDeLaVenta);
    }

    // Si es venta a crédito, sumar el total a la deuda del cliente
    const tipoVenta = await this.tipoDeVentaRepository.findOne({
      where: { id: createVentaDto.tipo_de_venta_id },
    });
    const descripcion = (tipoVenta?.descripcion ?? '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
    const esCredito = descripcion.includes('credito');

    if (esCredito) {
      const cliente = await this.clienteRepository.findOne({
        where: { id: createVentaDto.cliente_id },
      });
      if (cliente) {
        const nuevaDeuda =
          (cliente.deuda ?? 0) + createVentaDto.valor_total;
        await this.clienteRepository.update(createVentaDto.cliente_id, {
          deuda: nuevaDeuda,
        });
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
        ventaActual.productosDeLaVenta?.map((pv) => pv.productoId) ?? [];
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
      venta.productosDeLaVenta?.map((pv) => pv.productoId) ?? [];
    await this.restaurarStock(productoIds);
    await this.productoDeLaVentaRepository.delete({ ventaId: id });
    await this.ventaRepository.delete(id);
  }
}
