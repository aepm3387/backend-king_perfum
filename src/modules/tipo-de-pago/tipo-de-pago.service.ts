import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TipoDePago } from './entities/tipo-de-pago.entity';
import { CreateTipoDePagoDto } from './dto/create-tipo-de-pago.dto';
import { UpdateTipoDePagoDto } from './dto/update-tipo-de-pago.dto';

@Injectable()
export class TipoDePagoService {
  constructor(
    @InjectRepository(TipoDePago)
    private readonly tipoDePagoRepository: Repository<TipoDePago>,
  ) {}

  async create(createTipoDePagoDto: CreateTipoDePagoDto): Promise<TipoDePago> {
    const tipoDePago =
      this.tipoDePagoRepository.create(createTipoDePagoDto);
    return this.tipoDePagoRepository.save(tipoDePago);
  }

  async findAll(): Promise<TipoDePago[]> {
    return this.tipoDePagoRepository.find();
  }

  async findOne(id: number): Promise<TipoDePago> {
    const tipoDePago = await this.tipoDePagoRepository.findOne({
      where: { id },
    });
    if (!tipoDePago) {
      throw new NotFoundException(`Tipo de pago con id ${id} no encontrado`);
    }
    return tipoDePago;
  }

  async update(
    id: number,
    updateTipoDePagoDto: UpdateTipoDePagoDto,
  ): Promise<TipoDePago> {
    await this.findOne(id);
    await this.tipoDePagoRepository.update(id, updateTipoDePagoDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.tipoDePagoRepository.delete(id);
  }
}
