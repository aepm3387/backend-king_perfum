import { IsString, IsInt, MaxLength } from 'class-validator';

export class CreateUsuarioDto {
  @IsString()
  @MaxLength(50)
  nombre_completo: string;

  @IsString()
  @MaxLength(50)
  usuario: string;

  @IsString()
  @MaxLength(200)
  contraseña: string;

  @IsInt()
  rol_id: number;
}
