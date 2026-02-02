import { IsString, IsOptional, MaxLength } from 'class-validator';

export class CreateTipoDeVentaDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  descripcion?: string;
}
