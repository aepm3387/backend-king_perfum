import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Cliente } from '../../clientes/entities/cliente.entity';
import { TipoDeVenta } from '../../tipo-de-venta/entities/tipo-de-venta.entity';
import { TipoDePago } from '../../tipo-de-pago/entities/tipo-de-pago.entity';
import { ProductoDeLaVenta } from '../../producto-de-la-venta/entities/producto-de-la-venta.entity';

@Entity('ventas')
export class Venta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'timestamp',
    name: 'fecha',
    default: () => 'CURRENT_TIMESTAMP',
  })
  fecha: Date;

  @Column({ type: 'int', name: 'valor_total' })
  valorTotal: number;

  @Column({ type: 'int', name: 'tipo_de_venta_id' })
  tipoDeVentaId: number;

  @Column({ type: 'int', name: 'tipo_de_pago_id' })
  tipoDePagoId: number;

  @Column({ type: 'int', name: 'cliente_id' })
  clienteId: number;

  @ManyToOne(() => TipoDeVenta, (tipoDeVenta) => tipoDeVenta.ventas)
  @JoinColumn({ name: 'tipo_de_venta_id' })
  tipoDeVenta: TipoDeVenta;

  @ManyToOne(() => TipoDePago, (tipoDePago) => tipoDePago.ventas)
  @JoinColumn({ name: 'tipo_de_pago_id' })
  tipoDePago: TipoDePago;

  @ManyToOne(() => Cliente, (cliente) => cliente.ventas)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @OneToMany(
    () => ProductoDeLaVenta,
    (productoDeLaVenta) => productoDeLaVenta.venta,
  )
  productosDeLaVenta: ProductoDeLaVenta[];
}
