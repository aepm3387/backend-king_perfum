import { Injectable, NotFoundException, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { TipoDePago } from './entities/tipo-de-pago.entity';
import { CreateTipoDePagoDto } from './dto/create-tipo-de-pago.dto';
import { UpdateTipoDePagoDto } from './dto/update-tipo-de-pago.dto';

@Injectable()
export class TipoDePagoService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(TipoDePago)
    private readonly tipoDePagoRepository: Repository<TipoDePago>,
    private readonly dataSource: DataSource,
  ) {}

  async onApplicationBootstrap() {
    await this.seedDefaultIfEmpty();
  }

  /** Asegura que exista al menos un tipo de pago (id=1) y ventas con NULL apunten a él. */
  private async seedDefaultIfEmpty(): Promise<void> {
    const count = await this.tipoDePagoRepository.count();
    if (count === 0) {
      await this.tipoDePagoRepository.save(
        this.tipoDePagoRepository.create({ nombre: 'Efectivo' }),
      );
    }
    // Asignar tipo_de_pago_id = 1 a ventas que lo tengan NULL (migración suave)
    await this.dataSource.query(
      `UPDATE ventas SET tipo_de_pago_id = 1 WHERE tipo_de_pago_id IS NULL`,
    );
  }

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
