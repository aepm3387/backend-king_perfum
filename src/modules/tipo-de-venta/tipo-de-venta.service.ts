import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoDeVenta } from './entities/tipo-de-venta.entity';
import { CreateTipoDeVentaDto } from './dto/create-tipo-de-venta.dto';
import { UpdateTipoDeVentaDto } from './dto/update-tipo-de-venta.dto';

@Injectable()
export class TipoDeVentaService {
  constructor(
    @InjectRepository(TipoDeVenta)
    private readonly tipoDeVentaRepository: Repository<TipoDeVenta>,
  ) {}

  async create(
    createTipoDeVentaDto: CreateTipoDeVentaDto,
  ): Promise<TipoDeVenta> {
    const tipoDeVenta =
      this.tipoDeVentaRepository.create(createTipoDeVentaDto);
    return this.tipoDeVentaRepository.save(tipoDeVenta);
  }

  async findAll(): Promise<TipoDeVenta[]> {
    return this.tipoDeVentaRepository.find();
  }

  async findOne(id: number): Promise<TipoDeVenta> {
    const tipoDeVenta = await this.tipoDeVentaRepository.findOne({
      where: { id },
    });
    if (!tipoDeVenta) {
      throw new NotFoundException(`Tipo de venta con id ${id} no encontrado`);
    }
    return tipoDeVenta;
  }

  async update(
    id: number,
    updateTipoDeVentaDto: UpdateTipoDeVentaDto,
  ): Promise<TipoDeVenta> {
    await this.findOne(id);
    await this.tipoDeVentaRepository.update(id, updateTipoDeVentaDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.tipoDeVentaRepository.delete(id);
  }
}
