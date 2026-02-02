import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TipoDeVentaService } from './tipo-de-venta.service';
import { TipoDeVentaController } from './tipo-de-venta.controller';
import { TipoDeVenta } from './entities/tipo-de-venta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TipoDeVenta])],
  controllers: [TipoDeVentaController],
  providers: [TipoDeVentaService],
  exports: [TipoDeVentaService],
})
export class TipoDeVentaModule {}
