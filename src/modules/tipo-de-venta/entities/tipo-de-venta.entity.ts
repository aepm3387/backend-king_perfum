import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Venta } from '../../ventas/entities/venta.entity';

@Entity('tipo_de_venta')
export class TipoDeVenta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 200, nullable: true })
  descripcion: string | null;

  @OneToMany(() => Venta, (venta) => venta.tipoDeVenta)
  ventas: Venta[];
}
