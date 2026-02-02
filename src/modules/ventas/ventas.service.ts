import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from './entities/venta.entity';
import { ProductoDeLaVenta } from '../producto-de-la-venta/entities/producto-de-la-venta.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { TipoDeVenta } from '../tipo-de-venta/entities/tipo-de-venta.entity';
import { CreateVentaDto } from './dto/create-venta.dto';
import { UpdateVentaDto } from './dto/update-venta.dto';

@Injectable()
export class VentasService {
  constructor(
    @InjectRepository(Venta)
    private readonly ventaRepository: Repository<Venta>,
    @InjectRepository(ProductoDeLaVenta)
    private readonly productoDeLaVentaRepository: Repository<ProductoDeLaVenta>,
    @InjectRepository(Cliente)
    private readonly clienteRepository: Repository<Cliente>,
    @InjectRepository(TipoDeVenta)
    private readonly tipoDeVentaRepository: Repository<TipoDeVenta>,
  ) {}

  async create(createVentaDto: CreateVentaDto): Promise<Venta> {
    const venta = this.ventaRepository.create({
      valorTotal: createVentaDto.valor_total,
      tipoDeVentaId: createVentaDto.tipo_de_venta_id,
      clienteId: createVentaDto.cliente_id,
    });
    const ventaGuardada = await this.ventaRepository.save(venta);

    if (createVentaDto.producto_ids?.length) {
      const productosDeLaVenta = createVentaDto.producto_ids.map(
        (productoId) =>
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
      relations: ['cliente', 'tipoDeVenta', 'productosDeLaVenta', 'productosDeLaVenta.producto'],
    });
  }

  async findOne(id: number): Promise<Venta> {
    const venta = await this.ventaRepository.findOne({
      where: { id },
      relations: ['cliente', 'tipoDeVenta', 'productosDeLaVenta', 'productosDeLaVenta.producto'],
    });
    if (!venta) {
      throw new NotFoundException(`Venta con id ${id} no encontrada`);
    }
    return venta;
  }

  async update(id: number, updateVentaDto: UpdateVentaDto): Promise<Venta> {
    await this.findOne(id);
    await this.ventaRepository.update(id, {
      ...(updateVentaDto.valor_total !== undefined && {
        valorTotal: updateVentaDto.valor_total,
      }),
      ...(updateVentaDto.tipo_de_venta_id !== undefined && {
        tipoDeVentaId: updateVentaDto.tipo_de_venta_id,
      }),
      ...(updateVentaDto.cliente_id !== undefined && {
        clienteId: updateVentaDto.cliente_id,
      }),
    });

    if (updateVentaDto.producto_ids !== undefined) {
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

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.productoDeLaVentaRepository.delete({ ventaId: id });
    await this.ventaRepository.delete(id);
  }
}
