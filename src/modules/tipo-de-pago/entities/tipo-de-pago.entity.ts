import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Venta } from '../../ventas/entities/venta.entity';

@Entity('tipos_de_pago')
export class TipoDePago {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: false })
  nombre: string;

  @OneToMany(() => Venta, (venta) => venta.tipoDePago)
  ventas: Venta[];
}
