import { IsInt, IsOptional } from 'class-validator';

export class UpdateAbonoDto {
  @IsOptional()
  @IsInt()
  cliente_id?: number;

  @IsOptional()
  @IsInt()
  valor_pre_abono?: number;

  @IsOptional()
  @IsInt()
  valor_de_abono?: number;

  @IsOptional()
  @IsInt()
  valor_post_abono?: number;
}
