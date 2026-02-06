import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>,
  ) {}

  async create(createProductoDto: CreateProductoDto): Promise<Producto> {
    const producto = this.productoRepository.create({
      nombre: createProductoDto.nombre,
      precioDeVenta: createProductoDto.precio_de_venta,
      precioCompra: createProductoDto.precio_compra,
      genero: createProductoDto.genero,
      cantidad: createProductoDto.cantidad ?? 0,
      categoriaId: createProductoDto.categoria_id ?? null,
    });
    return this.productoRepository.save(producto);
  }

  async findAll(): Promise<Producto[]> {
    return this.productoRepository.find({ relations: ['categoria'] });
  }

  async findOne(id: number): Promise<Producto> {
    const producto = await this.productoRepository.findOne({
      where: { id },
      relations: ['categoria'],
    });
    if (!producto) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }
    return producto;
  }

  async update(
    id: number,
    updateProductoDto: UpdateProductoDto,
  ): Promise<Producto> {
    await this.findOne(id);
    const updateData: Partial<Producto> = {};
    if (updateProductoDto.nombre !== undefined) updateData.nombre = updateProductoDto.nombre;
    if (updateProductoDto.precio_de_venta !== undefined) updateData.precioDeVenta = updateProductoDto.precio_de_venta;
    if (updateProductoDto.precio_compra !== undefined) updateData.precioCompra = updateProductoDto.precio_compra;
    if (updateProductoDto.genero !== undefined) updateData.genero = updateProductoDto.genero;
    if (updateProductoDto.cantidad !== undefined) updateData.cantidad = updateProductoDto.cantidad;
    if (updateProductoDto.categoria_id !== undefined) updateData.categoriaId = updateProductoDto.categoria_id;
    await this.productoRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.productoRepository.delete(id);
  }
}
