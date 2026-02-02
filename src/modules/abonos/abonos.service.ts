import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Abono } from './entities/abono.entity';
import { CreateAbonoDto } from './dto/create-abono.dto';
import { UpdateAbonoDto } from './dto/update-abono.dto';

@Injectable()
export class AbonosService {
  constructor(
    @InjectRepository(Abono)
    private readonly abonoRepository: Repository<Abono>,
  ) {}

  async create(createAbonoDto: CreateAbonoDto): Promise<Abono> {
    const abono = this.abonoRepository.create({
      clienteId: createAbonoDto.cliente_id,
      valorPreAbono: createAbonoDto.valor_pre_abono,
      valorDeAbono: createAbonoDto.valor_de_abono,
      valorPostAbono: createAbonoDto.valor_post_abono,
    });
    return this.abonoRepository.save(abono);
  }

  async findAll(): Promise<Abono[]> {
    return this.abonoRepository.find({ relations: ['cliente'] });
  }

  async findByCliente(clienteId: number): Promise<Abono[]> {
    return this.abonoRepository.find({
      where: { clienteId },
      relations: ['cliente'],
    });
  }

  async findOne(id: number): Promise<Abono> {
    const abono = await this.abonoRepository.findOne({
      where: { id },
      relations: ['cliente'],
    });
    if (!abono) {
      throw new NotFoundException(`Abono con id ${id} no encontrado`);
    }
    return abono;
  }

  async update(id: number, updateAbonoDto: UpdateAbonoDto): Promise<Abono> {
    await this.findOne(id);
    const updateData: Partial<Abono> = {};
    if (updateAbonoDto.cliente_id !== undefined) updateData.clienteId = updateAbonoDto.cliente_id;
    if (updateAbonoDto.valor_pre_abono !== undefined) updateData.valorPreAbono = updateAbonoDto.valor_pre_abono;
    if (updateAbonoDto.valor_de_abono !== undefined) updateData.valorDeAbono = updateAbonoDto.valor_de_abono;
    if (updateAbonoDto.valor_post_abono !== undefined) updateData.valorPostAbono = updateAbonoDto.valor_post_abono;
    await this.abonoRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.abonoRepository.delete(id);
  }
}
