import { User } from '../../users/entities/user.entity';

export class SaveCommentDto {
  parentCommentId?: number;

  text: string;

  user: User;

  fileName?: string;

  file?: string;
}
