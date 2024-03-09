import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class CommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ nullable: true })
  parentCommentId?: number;

  @Column()
  text: string;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;

  @Column({
    // type: 'bytea',
    nullable: true,
  })
  file?: string;

  @Column({ nullable: true })
  fileName?: string;

  @OneToMany(() => CommentEntity, (comment) => comment.parentCommentId, {
    nullable: true,
  })
  @JoinColumn({ name: 'parentCommentId' })
  children?: CommentEntity[];
}
