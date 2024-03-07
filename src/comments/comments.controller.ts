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

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

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
      comment.file = image.buffer;
      comment.fileName = image.originalname;
    }
    comment.text = text;
    if (id) {
      if (isNaN(id)) {
        return 'Ошибка: parentCommentId не является числом';
      }
      comment.parentCommentId = parrentCommentId;
    }
    return await this.commentsService.create(comment, user);
  }
  @Get('sort')
  async findBy(@Body() sortCommentDto: SortCommentDto) {
    return await this.commentsService.findBy(sortCommentDto);
  }
}
