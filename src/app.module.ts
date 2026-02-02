import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth.controller';
import { CategoriaModule } from './modules/categoria/categoria.module';
import { ClientesModule } from './modules/clientes/clientes.module';
import { AbonosModule } from './modules/abonos/abonos.module';
import { ProductosModule } from './modules/productos/productos.module';
import { RolesModule } from './modules/roles/roles.module';
import { TipoDeVentaModule } from './modules/tipo-de-venta/tipo-de-venta.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { VentasModule } from './modules/ventas/ventas.module';
import { ProductoDeLaVentaModule } from './modules/producto-de-la-venta/producto-de-la-venta.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USERNAME || 'root',
      password: process.env.DB_PASSWORD || '1234',
      database: process.env.DB_DATABASE || 'king_perfum',
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    CategoriaModule,
    ClientesModule,
    AbonosModule,
    ProductosModule,
    RolesModule,
    TipoDeVentaModule,
    UsuariosModule,
    VentasModule,
    ProductoDeLaVentaModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
