import { IsString, IsInt, IsOptional, MaxLength, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateProductoDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  nombre?: string;

  @IsOptional()
  @IsInt()
  precio_de_venta?: number;

  @IsOptional()
  @IsInt()
  precio_compra?: number;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  genero?: string;

  @IsOptional()
  @IsInt()
  cantidad?: number;

  @IsOptional()
  @IsInt()
  categoria_id?: number;

  @IsOptional()
  @Transform(({ value }) => (value === undefined ? undefined : value === true || value === 'true'))
  @IsBoolean()
  activo?: boolean;
}
