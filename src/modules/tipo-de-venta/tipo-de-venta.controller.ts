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
import { TipoDeVentaService } from './tipo-de-venta.service';
import { CreateTipoDeVentaDto } from './dto/create-tipo-de-venta.dto';
import { UpdateTipoDeVentaDto } from './dto/update-tipo-de-venta.dto';

@Controller('tipos-de-venta')
export class TipoDeVentaController {
  constructor(private readonly tipoDeVentaService: TipoDeVentaService) {}

  @Post()
  create(@Body() createTipoDeVentaDto: CreateTipoDeVentaDto) {
    return this.tipoDeVentaService.create(createTipoDeVentaDto);
  }

  @Get()
  findAll() {
    return this.tipoDeVentaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tipoDeVentaService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTipoDeVentaDto: UpdateTipoDeVentaDto,
  ) {
    return this.tipoDeVentaService.update(id, updateTipoDeVentaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tipoDeVentaService.remove(id);
  }
}
