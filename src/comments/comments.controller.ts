import {
  Controller,
  Get,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../users/entities/user.entity';
import { SortCommentDto } from './dto/sorting-comment.dto';
import { UserDecorator } from '../auth/decorators/user.decorator';
import { CommentsGateway } from './comments.gateway';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly commentsGateway: CommentsGateway,
    @InjectQueue('comments') private readonly commentsQueue: Queue,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('add')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UserDecorator() user: User,
    @Body() body: { text: string; parrentCommentId: number },
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { text, parrentCommentId } = body;
    const image = file;
    const id = parrentCommentId;

    let comment = new CreateCommentDto();
    if (image) {
      const base64String = image.buffer.toString('base64');
      comment.file = base64String;
      comment.fileName = image.originalname;
    }
    if (!text) {
      return 'Ошибка: parentCommentId не является числом';
    }
    comment.text = text;
    if (id) {
      if (isNaN(id)) {
        return 'Ошибка: parentCommentId не является числом';
      }
      comment.parentCommentId = parrentCommentId;
    }

    // return await this.commentsService.create(comment, user);
    const job = await this.commentsQueue.add('createComment', {
      comment,
      user,
    });
    await job.finished();
    return 'Комментарий успешно создан.';
  }
  @Get('sort')
  async findBy(@Body() sortCommentDto: SortCommentDto) {
    return await this.commentsService.findBy(sortCommentDto);
  }
  @Get('comment')
  async getComment() {
    this.commentsGateway.handleGetComments(null);
  }
}
