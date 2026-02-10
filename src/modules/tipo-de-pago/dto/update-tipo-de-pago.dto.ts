import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoDePagoDto } from './create-tipo-de-pago.dto';

export class UpdateTipoDePagoDto extends PartialType(CreateTipoDePagoDto) {}
