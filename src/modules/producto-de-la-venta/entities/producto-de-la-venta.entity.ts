import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Producto } from '../../productos/entities/producto.entity';
import { Venta } from '../../ventas/entities/venta.entity';

@Entity('producto_de_la_venta')
export class ProductoDeLaVenta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', name: 'venta_id' })
  ventaId: number;

  @Column({ type: 'int', name: 'producto_id' })
  productoId: number;

  @ManyToOne(() => Venta, (venta) => venta.productosDeLaVenta)
  @JoinColumn({ name: 'venta_id' })
  venta: Venta;

  @ManyToOne(() => Producto, (producto) => producto.productosDeLaVenta)
  @JoinColumn({ name: 'producto_id' })
  producto: Producto;
}
