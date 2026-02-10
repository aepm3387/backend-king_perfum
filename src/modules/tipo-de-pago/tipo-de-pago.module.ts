import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoDePagoService } from './tipo-de-pago.service';
import { TipoDePagoController } from './tipo-de-pago.controller';
import { TipoDePago } from './entities/tipo-de-pago.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoDePago])],
  controllers: [TipoDePagoController],
  providers: [TipoDePagoService],
  exports: [TipoDePagoService],
})
export class TipoDePagoModule {}
