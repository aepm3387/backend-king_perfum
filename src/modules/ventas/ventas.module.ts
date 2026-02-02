import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VentasService } from './ventas.service';
import { VentasController } from './ventas.controller';
import { Venta } from './entities/venta.entity';
import { ProductoDeLaVenta } from '../producto-de-la-venta/entities/producto-de-la-venta.entity';
import { Cliente } from '../clientes/entities/cliente.entity';
import { TipoDeVenta } from '../tipo-de-venta/entities/tipo-de-venta.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Venta, ProductoDeLaVenta, Cliente, TipoDeVenta]),
  ],
  controllers: [VentasController],
  providers: [VentasService],
  exports: [VentasService],
})
export class VentasModule {}
