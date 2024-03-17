export class CreateCommentDto {
  parentCommentId?: number;

  text: string;

  fileName?: string;

  file?: string;
}
