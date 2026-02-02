import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoDeLaVentaService } from './producto-de-la-venta.service';
import { ProductoDeLaVentaController } from './producto-de-la-venta.controller';
import { ProductoDeLaVenta } from './entities/producto-de-la-venta.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductoDeLaVenta])],
  controllers: [ProductoDeLaVentaController],
  providers: [ProductoDeLaVentaService],
  exports: [ProductoDeLaVentaService],
})
export class ProductoDeLaVentaModule {}
