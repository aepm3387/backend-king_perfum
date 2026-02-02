import { PartialType } from '@nestjs/mapped-types';
import { CreateTipoDeVentaDto } from './create-tipo-de-venta.dto';

export class UpdateTipoDeVentaDto extends PartialType(CreateTipoDeVentaDto) {}
