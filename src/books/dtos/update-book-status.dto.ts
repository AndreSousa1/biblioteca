import { IsEnum } from 'class-validator';
import { BookStatus } from '@prisma/client';

export class UpdateBookStatusDto {
  @IsEnum(BookStatus)
  status!: BookStatus; // 'AVAILABLE' | 'BORROWED'
}
