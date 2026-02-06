import { IsString, IsInt, IsOptional, MaxLength } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  @MaxLength(50)
  nombre: string;

  @IsInt()
  precio_de_venta: number;

  @IsInt()
  precio_compra: number;

  @IsString()
  @MaxLength(10)
  genero: string;

  @IsOptional()
  @IsInt()
  cantidad?: number;

  @IsOptional()
  @IsInt()
  categoria_id?: number;
}
