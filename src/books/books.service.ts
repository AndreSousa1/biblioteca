import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dtos/create-book.dto';
import { UpdateBookStatusDto } from './dtos/update-book-status.dto';
import { BookStatus } from '@prisma/client';

@Injectable()
export class BooksService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateBookDto) {
    return this.prisma.book.create({ data: { ...dto } });
  }

  findAll(status?: BookStatus, q?: string) {
    return this.prisma.book.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(q ? { title: { contains: q, mode: 'insensitive' } } : {}),
      },
      orderBy: { id: 'asc' },
    });
  }

  async updateStatus(id: number, dto: UpdateBookStatusDto) {
    const book = await this.prisma.book.findUnique({ where: { id } });
    if (!book) throw new NotFoundException('Book not found');

    if (dto.status === 'BORROWED') {
      const openLoan = await this.prisma.loan.findFirst({
        where: { bookId: id, returnDate: null },
      });
      if (openLoan) throw new BadRequestException('Book is already borrowed');
    }

    return this.prisma.book.update({
      where: { id },
      data: { status: dto.status },
    });
  }
}
