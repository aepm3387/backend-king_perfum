import { IsString, MaxLength } from 'class-validator';

export class CreateTipoDePagoDto {
  @IsString()
  @MaxLength(100)
  nombre: string;
}
