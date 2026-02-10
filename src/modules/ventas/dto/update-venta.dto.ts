import { IsInt, IsArray, IsOptional } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class UpdateVentaDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  valor_total?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  tipo_de_venta_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  tipo_de_pago_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  cliente_id?: number;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => (Array.isArray(value) ? value.map((v) => Number(v)) : value))
  @IsInt({ each: true })
  producto_ids?: number[];
}
