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
import { ProductoDeLaVentaService } from './producto-de-la-venta.service';
import { CreateProductoDeLaVentaDto } from './dto/create-producto-de-la-venta.dto';
import { UpdateProductoDeLaVentaDto } from './dto/update-producto-de-la-venta.dto';

@Controller('productos-de-la-venta')
export class ProductoDeLaVentaController {
  constructor(
    private readonly productoDeLaVentaService: ProductoDeLaVentaService,
  ) {}

  @Post()
  create(@Body() createProductoDeLaVentaDto: CreateProductoDeLaVentaDto) {
    return this.productoDeLaVentaService.create(createProductoDeLaVentaDto);
  }

  @Get()
  findAll(@Query('ventaId') ventaId?: string) {
    if (ventaId) {
      return this.productoDeLaVentaService.findByVenta(
        parseInt(ventaId, 10),
      );
    }
    return this.productoDeLaVentaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productoDeLaVentaService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductoDeLaVentaDto: UpdateProductoDeLaVentaDto,
  ) {
    return this.productoDeLaVentaService.update(id, updateProductoDeLaVentaDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productoDeLaVentaService.remove(id);
  }
}
