import { IsInt, IsArray, IsOptional } from 'class-validator';

export class UpdateVentaDto {
  @IsOptional()
  @IsInt()
  valor_total?: number;

  @IsOptional()
  @IsInt()
  tipo_de_venta_id?: number;

  @IsOptional()
  @IsInt()
  cliente_id?: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  producto_ids?: number[];
}
