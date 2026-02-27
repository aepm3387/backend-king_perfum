import { IsInt, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class ItemVentaDto {
  @Type(() => Number)
  @IsInt()
  producto_id: number;

  @Type(() => Number)
  @IsInt()
  cantidad: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  precio_unitario?: number;
}

export class CreateVentaDto {
  @Type(() => Number)
  @IsInt()
  valor_total: number;

  @Type(() => Number)
  @IsInt()
  tipo_de_venta_id: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  tipo_de_pago_id?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  cliente_id?: number;

  /** Líneas de la venta con cantidad y precio opcional (si no se envía precio se usa el del producto). */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ItemVentaDto)
  productos?: ItemVentaDto[];

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => (Array.isArray(value) ? value.map((v) => Number(v)) : value))
  @IsInt({ each: true })
  producto_ids?: number[];
}
