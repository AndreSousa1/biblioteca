import { BooksService } from '../../src/books/books.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { BookStatus } from '@prisma/client';
import { UpdateBookStatusDto } from '../../src/books/dtos/update-book-status.dto';

describe('BooksService', () => {
  let service: BooksService;

  // Mocks individuais para evitar problemas de tipagem do Prisma
  let bookCreate: jest.Mock;
  let bookFindMany: jest.Mock;
  let bookFindUnique: jest.Mock;
  let bookUpdate: jest.Mock;
  let loanFindFirst: jest.Mock;

  beforeEach(() => {
    bookCreate = jest.fn();
    bookFindMany = jest.fn();
    bookFindUnique = jest.fn();
    bookUpdate = jest.fn();
    loanFindFirst = jest.fn();

    const prismaMock = {
      book: {
        create: bookCreate,
        findMany: bookFindMany,
        findUnique: bookFindUnique,
        update: bookUpdate,
      },
      loan: {
        findFirst: loanFindFirst,
      },
    } as unknown as PrismaService;

    service = new BooksService(prismaMock);
  });

  it('deve criar livro', async () => {
    bookCreate.mockResolvedValue({
      id: 1,
      title: 'Clean Code',
      author: 'Robert C. Martin',
      publishedYear: 2008,
      status: 'AVAILABLE',
    });

    const res = await service.create({
      title: 'Clean Code',
      author: 'Robert C. Martin',
      publishedYear: 2008,
    });

    expect(res.id).toBe(1);
    expect(bookCreate).toHaveBeenCalledWith({
      data: {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        publishedYear: 2008,
      },
    });
  });

  it('deve filtrar por status e busca por título', async () => {
    bookFindMany.mockResolvedValue([]);

    await service.findAll('AVAILABLE' as BookStatus, 'clean');

    expect(bookFindMany).toHaveBeenCalledWith({
      where: {
        status: 'AVAILABLE',
        title: { contains: 'clean', mode: 'insensitive' },
      },
      orderBy: { id: 'asc' },
    });
  });

  it('não deve permitir BORROWED se já houver empréstimo aberto', async () => {
    bookFindUnique.mockResolvedValue({ id: 1 });
    loanFindFirst.mockResolvedValue({ id: 99 });

    const dto: UpdateBookStatusDto = { status: 'BORROWED' as BookStatus };

    await expect(service.updateStatus(1, dto)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('deve lançar NotFound se livro não existir ao atualizar status', async () => {
    bookFindUnique.mockResolvedValue(null);
    const dto: UpdateBookStatusDto = { status: 'AVAILABLE' as BookStatus };

    await expect(service.updateStatus(123, dto)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('deve atualizar status quando permitido', async () => {
    bookFindUnique.mockResolvedValue({ id: 1, status: 'AVAILABLE' });
    loanFindFirst.mockResolvedValue(null);
    bookUpdate.mockResolvedValue({ id: 1, status: 'BORROWED' });

    const dto: UpdateBookStatusDto = { status: 'BORROWED' as BookStatus };

    const res = await service.updateStatus(1, dto);

    expect(res).toEqual({ id: 1, status: 'BORROWED' });
    expect(bookUpdate).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { status: 'BORROWED' },
    });
  });
});
