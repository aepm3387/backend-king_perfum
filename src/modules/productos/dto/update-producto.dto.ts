import { IsString, IsInt, IsOptional, MaxLength } from 'class-validator';

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
  categoria_id?: number;
}
