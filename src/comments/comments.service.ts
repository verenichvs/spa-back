import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { CommentEntity } from './entities/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { SaveCommentDto } from './dto/save-comment.dto';
import { SortCommentDto } from './dto/sorting-comment.dto';
import * as mimeTypes from 'mime-types';
import Jimp from 'jimp';
import { ReturnCommentDto } from './dto/return-comment.dto';
import { UserEmailDate } from './types/coment.sort.enum';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(CommentEntity)
    private readonly commentEntityRepository: Repository<CommentEntity>,
  ) {}

  async closedTags(text: string): Promise<boolean> {
    let openTagsCount = 0;

    const regex = /<\/?\s*([^\s>\/]+)[^>]*>/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const [fullTag, tagName] = match;

      if (fullTag.startsWith('</')) {
        if (openTagsCount === 0) {
          return false;
        }
        openTagsCount--;
      } else if (!fullTag.endsWith('/')) {
        openTagsCount++;
      }
    }

    if (openTagsCount > 0) {
      return false;
    }

    return true;
  }

  async validateHtmlTags(text: string): Promise<boolean> {
    const hasHtmlTagsRegex = /<[a-z][\s\S]*>/i;
    if (!hasHtmlTagsRegex.test(text)) {
      return true;
    }
    const htmlTagsRegex =
      /<a\s[^>]*href=(['"])(.*?)\1[^>]*>|<code>|<\/code>|<i>|<\/i>|<strong>|<\/strong>/g;
    const isValidHtml = htmlTagsRegex.test(text);
    const closeTags = await this.closedTags(text);
    return isValidHtml && closeTags;
  }

  async createCommentWithoutFile(
    createCommentDto: CreateCommentDto,
    user: User,
  ) {
    let saveCommentDto = new SaveCommentDto();
    saveCommentDto.user = user;
    saveCommentDto.text = createCommentDto.text;
    saveCommentDto.parentCommentId = createCommentDto.parentCommentId;

    const comment = await this.commentEntityRepository.create(saveCommentDto);
    return await this.commentEntityRepository.save(comment);
  }
  async createCommentWithFile(
    createCommentDto: CreateCommentDto,
    user: User,
    file: string,
  ) {
    let saveCommentDto = new SaveCommentDto();
    saveCommentDto.user = user;
    saveCommentDto.text = createCommentDto.text;
    saveCommentDto.file = file;
    saveCommentDto.fileName = createCommentDto.fileName;
    saveCommentDto.parentCommentId = createCommentDto.parentCommentId;

    const comment = await this.commentEntityRepository.create(saveCommentDto);
    const savedComment = await this.commentEntityRepository.save(comment);

    let returnedComment = new ReturnCommentDto();
    returnedComment.id = savedComment.id;
    returnedComment.createdAt = savedComment.createdAt;
    returnedComment.fileName = savedComment.fileName;
    returnedComment.parentCommentId = savedComment.parentCommentId;
    returnedComment.text = savedComment.text;
    returnedComment.user = savedComment.user;

    return returnedComment;
  }

  async create(createCommentDto: CreateCommentDto, user: User) {
    const check = await this.validateHtmlTags(createCommentDto.text);
    if (check === false) throw new Error('Некорректный HTML текст');
    if (createCommentDto.file === undefined) {
      return await this.createCommentWithoutFile(createCommentDto, user);
    }
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'text/plain',
    ];

    const mimeType = mimeTypes.lookup(createCommentDto.fileName);
    if (!allowedMimeTypes.includes(mimeType)) {
      throw new BadRequestException('Invalid file format');
    }
    const isImage = mimeType && mimeType.startsWith('image/');
    if (!isImage) {
      if (!createCommentDto.file || createCommentDto.file.length === 0) {
        throw new BadRequestException('Empty text file');
      }
      const maxSizeInBytes = 100 * 1024;
      if (createCommentDto.file.length > maxSizeInBytes) {
        throw new BadRequestException('File size exceeds the limit (100 KB)');
      }

      return await this.createCommentWithFile(
        createCommentDto,
        user,
        createCommentDto.file,
      );
    }
    if (isImage) {
      if (mimeType === 'image/gif') {
        createCommentDto.fileName = mimeType;
        return await this.createCommentWithFile(
          createCommentDto,
          user,
          createCommentDto.file,
        );
      }
      let buffer = Buffer.from(createCommentDto.file, 'base64');
      const imageBuffer = await Jimp.read(buffer);
      const maxWidth = 320;
      const maxHeight = 240;

      if (
        imageBuffer.getWidth() > maxWidth ||
        imageBuffer.getHeight() > maxHeight
      ) {
        await imageBuffer.resize(maxWidth, maxHeight);
        buffer = await imageBuffer.getBufferAsync(Jimp.MIME_JPEG);
      }
      const base64String = buffer.toString('base64');
      createCommentDto.fileName = mimeType;
      return await this.createCommentWithFile(
        createCommentDto,
        user,
        base64String,
      );
    }
  }

  async findBy(sortCommentDto: SortCommentDto) {
    if (sortCommentDto.userEmailDate != UserEmailDate.DATE) {
      return await this.commentEntityRepository
        .createQueryBuilder('comment')
        .leftJoinAndSelect('comment.user', 'user')
        .where('comment.parentCommentId IS NULL')
        .orderBy(sortCommentDto.userEmailDate, sortCommentDto.hl)
        .addOrderBy('comment.createdAt', sortCommentDto.hl)
        .select([
          'comment.id',
          'comment.text',
          'comment.createdAt',
          'user.email',
          'user.username',
        ])
        .getMany();
    }
    return await this.commentEntityRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .where('comment.parentCommentId IS NULL')
      .orderBy('comment.createdAt', sortCommentDto.hl)
      .select([
        'comment.id',
        'comment.text',
        'comment.createdAt',
        'user.email',
        'user.username',
      ])
      .getMany();
  }

  async getAllComments(): Promise<CommentEntity[]> {
    const comments = await this.commentEntityRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .orderBy('comment.createdAt', 'ASC')
      .select([
        'comment.id',
        'comment.text',
        'comment.createdAt',
        'comment.parentCommentId',
        'comment.file',
        'comment.fileName',
        'user.id',
        'user.email',
        'user.username',
      ])
      .getMany();

    const commentsWithChildren = this.buildCommentTree(comments);

    return commentsWithChildren;
  }

  private buildCommentTree(comments: CommentEntity[]): CommentEntity[] {
    const commentMap = new Map<number, CommentEntity>();
    const rootComments: CommentEntity[] = [];

    comments.forEach((comment) => {
      const commentWithChildren = { ...comment, children: [] };
      commentMap.set(comment.id, commentWithChildren);

      const parentCommentId = comment.parentCommentId;
      if (parentCommentId === null || parentCommentId === undefined) {
        rootComments.push(commentWithChildren);
      } else {
        const parentComment = commentMap.get(parentCommentId);
        if (parentComment) {
          parentComment.children.push(commentWithChildren);
        }
      }
    });

    return rootComments;
  }
}
