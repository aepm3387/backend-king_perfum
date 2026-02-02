import { IsString, IsInt, MaxLength } from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @MaxLength(50)
  nombre_completo: string;

  @IsInt()
  deuda: number;
}
