import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductoDeLaVenta } from './entities/producto-de-la-venta.entity';
import { CreateProductoDeLaVentaDto } from './dto/create-producto-de-la-venta.dto';
import { UpdateProductoDeLaVentaDto } from './dto/update-producto-de-la-venta.dto';

@Injectable()
export class ProductoDeLaVentaService {
  constructor(
    @InjectRepository(ProductoDeLaVenta)
    private readonly productoDeLaVentaRepository: Repository<ProductoDeLaVenta>,
  ) {}

  async create(
    createProductoDeLaVentaDto: CreateProductoDeLaVentaDto,
  ): Promise<ProductoDeLaVenta> {
    const productoDeLaVenta = this.productoDeLaVentaRepository.create({
      ventaId: createProductoDeLaVentaDto.venta_id,
      productoId: createProductoDeLaVentaDto.producto_id,
    });
    return this.productoDeLaVentaRepository.save(productoDeLaVenta);
  }

  async findAll(): Promise<ProductoDeLaVenta[]> {
    return this.productoDeLaVentaRepository.find({
      relations: ['venta', 'producto'],
    });
  }

  async findByVenta(ventaId: number): Promise<ProductoDeLaVenta[]> {
    return this.productoDeLaVentaRepository.find({
      where: { ventaId },
      relations: ['venta', 'producto'],
    });
  }

  async findOne(id: number): Promise<ProductoDeLaVenta> {
    const productoDeLaVenta = await this.productoDeLaVentaRepository.findOne({
      where: { id },
      relations: ['venta', 'producto'],
    });
    if (!productoDeLaVenta) {
      throw new NotFoundException(
        `Producto de la venta con id ${id} no encontrado`,
      );
    }
    return productoDeLaVenta;
  }

  async update(
    id: number,
    updateProductoDeLaVentaDto: UpdateProductoDeLaVentaDto,
  ): Promise<ProductoDeLaVenta> {
    await this.findOne(id);
    await this.productoDeLaVentaRepository.update(id, {
      ...(updateProductoDeLaVentaDto.venta_id !== undefined && {
        ventaId: updateProductoDeLaVentaDto.venta_id,
      }),
      ...(updateProductoDeLaVentaDto.producto_id !== undefined && {
        productoId: updateProductoDeLaVentaDto.producto_id,
      }),
    });
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.productoDeLaVentaRepository.delete(id);
  }
}
