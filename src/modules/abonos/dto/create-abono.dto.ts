import { IsInt } from 'class-validator';

export class CreateAbonoDto {
  @IsInt()
  cliente_id: number;

  @IsInt()
  valor_pre_abono: number;

  @IsInt()
  valor_de_abono: number;

  @IsInt()
  valor_post_abono: number;
}
