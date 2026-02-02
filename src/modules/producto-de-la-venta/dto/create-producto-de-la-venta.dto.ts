import { IsInt } from 'class-validator';

export class CreateProductoDeLaVentaDto {
  @IsInt()
  venta_id: number;

  @IsInt()
  producto_id: number;
}
