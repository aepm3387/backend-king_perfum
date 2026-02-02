import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity';

@Entity('abonos')
export class Abono {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'cliente_id' })
  clienteId: number;

  @Column({ type: 'int', name: 'valor_pre_abono' })
  valorPreAbono: number;

  @Column({ type: 'int', name: 'valor_de_abono' })
  valorDeAbono: number;

  @Column({ type: 'int', name: 'valor_post_abono' })
  valorPostAbono: number;

  @ManyToOne(() => Cliente, (cliente) => cliente.abonos)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;
}
