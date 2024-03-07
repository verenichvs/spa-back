import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { CommentEntity } from '../../comments/entities/comment.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @OneToMany(() => CommentEntity, (comment) => comment.user, {
    eager: true,
    nullable: true,
  })
  comments?: CommentEntity[];
}
