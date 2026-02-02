import { IsString, IsInt, IsOptional, MaxLength } from 'class-validator';

export class UpdateUsuarioDto {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  nombre_completo?: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  usuario?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  contraseña?: string;

  @IsOptional()
  @IsInt()
  rol_id?: number;
}
