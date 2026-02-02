import { IsInt, IsArray, IsOptional } from 'class-validator';

export class CreateVentaDto {
  @IsInt()
  valor_total: number;

  @IsInt()
  tipo_de_venta_id: number;

  @IsInt()
  cliente_id: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  producto_ids?: number[];
}
