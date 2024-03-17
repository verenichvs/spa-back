import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentEntity } from './entities/comment.entity';
import { CommentsGateway } from './comments.gateway';
import { BullModule } from '@nestjs/bull';
import { AudioProcessor } from './audio/audio.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity]),
    BullModule.registerQueue({
      name: 'comments',
    }),
    TypeOrmModule.forFeature([CommentEntity]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsGateway, AudioProcessor],
})
export class CommentsModule {}
