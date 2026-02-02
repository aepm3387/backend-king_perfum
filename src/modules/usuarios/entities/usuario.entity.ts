import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Rol } from '../../roles/entities/rol.entity';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, name: 'nombre_completo' })
  nombreCompleto: string;

  @Column({ type: 'varchar', length: 50 })
  usuario: string;

  @Column({ type: 'varchar', length: 200 })
  contraseña: string;

  @Column({ type: 'int', name: 'rol_id' })
  rolId: number;

  @ManyToOne(() => Rol, (rol) => rol.usuarios)
  @JoinColumn({ name: 'rol_id' })
  rol: Rol;
}
