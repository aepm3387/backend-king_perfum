import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { UsuariosService } from './modules/usuarios/usuarios.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Post('login')
  async login(@Body() body: { usuario: string; contraseña: string }) {
    const usuario = await this.usuariosService.login(
      body.usuario,
      body.contraseña,
    );
    if (!usuario) {
      throw new UnauthorizedException('Usuario o contraseña incorrectos');
    }
    return usuario;
  }
}
