import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './entities/usuario.entity';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    const usuario = this.usuarioRepository.create({
      nombreCompleto: createUsuarioDto.nombre_completo,
      usuario: createUsuarioDto.usuario,
      contraseña: createUsuarioDto.contraseña,
      rolId: createUsuarioDto.rol_id,
    });
    return this.usuarioRepository.save(usuario);
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuarioRepository.find({ relations: ['rol'] });
  }

  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['rol'],
    });
    if (!usuario) {
      throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    }
    return usuario;
  }

  async update(
    id: number,
    updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<Usuario> {
    await this.findOne(id);
    const updateData: Partial<Usuario> = {};
    if (updateUsuarioDto.nombre_completo !== undefined) updateData.nombreCompleto = updateUsuarioDto.nombre_completo;
    if (updateUsuarioDto.usuario !== undefined) updateData.usuario = updateUsuarioDto.usuario;
    if (updateUsuarioDto.contraseña !== undefined) updateData.contraseña = updateUsuarioDto.contraseña;
    if (updateUsuarioDto.rol_id !== undefined) updateData.rolId = updateUsuarioDto.rol_id;
    await this.usuarioRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.usuarioRepository.delete(id);
  }

  async login(usuario: string, contraseña: string): Promise<Usuario | null> {
    const user = await this.usuarioRepository.findOne({
      where: { usuario, contraseña },
      relations: ['rol'],
    });
    return user ?? null;
  }
}
