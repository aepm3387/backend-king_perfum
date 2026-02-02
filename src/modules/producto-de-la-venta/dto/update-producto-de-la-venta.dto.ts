import { IsInt, IsOptional } from 'class-validator';

export class UpdateProductoDeLaVentaDto {
  @IsOptional()
  @IsInt()
  venta_id?: number;

  @IsOptional()
  @IsInt()
  producto_id?: number;
}
