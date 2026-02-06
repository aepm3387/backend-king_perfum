import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Categoria } from '../../categoria/entities/categoria.entity';
import { ProductoDeLaVenta } from '../../producto-de-la-venta/entities/producto-de-la-venta.entity';

@Entity('productos')
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  nombre: string;

  @Column({ type: 'int', name: 'precio_de_venta' })
  precioDeVenta: number;

  @Column({ type: 'int', name: 'precio_compra' })
  precioCompra: number;

  @Column({ type: 'varchar', length: 10 })
  genero: string;

  @Column({ type: 'int', default: 0 })
  cantidad: number;

  @Column({ type: 'int', name: 'categoria_id', nullable: true })
  categoriaId: number | null;

  @ManyToOne(() => Categoria, (categoria) => categoria.productos, {
    nullable: true,
  })
  @JoinColumn({ name: 'categoria_id' })
  categoria: Categoria | null;

  @OneToMany(
    () => ProductoDeLaVenta,
    (productoDeLaVenta) => productoDeLaVenta.producto,
  )
  productosDeLaVenta: ProductoDeLaVenta[];
}
