import { IsString, MaxLength } from 'class-validator';

export class CreateRolDto {
  @IsString()
  @MaxLength(20)
  descripcion: string;
}
