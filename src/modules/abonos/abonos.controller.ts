import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { AbonosService } from './abonos.service';
import { CreateAbonoDto } from './dto/create-abono.dto';
import { UpdateAbonoDto } from './dto/update-abono.dto';

@Controller('abonos')
export class AbonosController {
  constructor(private readonly abonosService: AbonosService) {}

  @Post()
  create(@Body() createAbonoDto: CreateAbonoDto) {
    return this.abonosService.create(createAbonoDto);
  }

  @Get()
  findAll(@Query('clienteId') clienteId?: string) {
    if (clienteId) {
      return this.abonosService.findByCliente(parseInt(clienteId, 10));
    }
    return this.abonosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.abonosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAbonoDto: UpdateAbonoDto,
  ) {
    return this.abonosService.update(id, updateAbonoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.abonosService.remove(id);
  }
}
