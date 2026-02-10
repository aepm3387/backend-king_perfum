import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { TipoDePagoService } from './tipo-de-pago.service';
import { CreateTipoDePagoDto } from './dto/create-tipo-de-pago.dto';
import { UpdateTipoDePagoDto } from './dto/update-tipo-de-pago.dto';

@Controller('tipos-de-pago')
export class TipoDePagoController {
  constructor(private readonly tipoDePagoService: TipoDePagoService) {}

  @Post()
  create(@Body() createTipoDePagoDto: CreateTipoDePagoDto) {
    return this.tipoDePagoService.create(createTipoDePagoDto);
  }

  @Get()
  findAll() {
    return this.tipoDePagoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tipoDePagoService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTipoDePagoDto: UpdateTipoDePagoDto,
  ) {
    return this.tipoDePagoService.update(id, updateTipoDePagoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tipoDePagoService.remove(id);
  }
}
