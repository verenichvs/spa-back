import { User } from '../../users/entities/user.entity';

export class ReturnCommentDto {
  id: number;

  parentCommentId?: number;

  text: string;

  user: User;

  fileName?: string;

  createdAt: Date;
}
