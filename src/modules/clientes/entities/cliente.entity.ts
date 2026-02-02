import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Abono } from '../../abonos/entities/abono.entity';
import { Venta } from '../../ventas/entities/venta.entity';

@Entity('clientes')
export class Cliente {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  nombre_completo: string;

  @Column({ type: 'int', default: 0 })
  deuda: number;

  @OneToMany(() => Abono, (abono) => abono.cliente)
  abonos: Abono[];

  @OneToMany(() => Venta, (venta) => venta.cliente)
  ventas: Venta[];
}
