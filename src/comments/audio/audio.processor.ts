import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { CommentsService } from '../comments.service';
import { User } from '../../users/entities/user.entity';
import { CreateCommentDto } from '../dto/create-comment.dto';

@Processor('comments')
export class AudioProcessor {
  constructor(private readonly commentsService: CommentsService) {}
  @Process('createComment')
  async createComment(job: Job<{ comment: CreateCommentDto; user: User }>) {
    const { comment, user } = job.data;
    await this.commentsService.create(comment, user);
  }
}
