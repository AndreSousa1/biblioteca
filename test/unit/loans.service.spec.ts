import { LoansService } from '../../src/loans/loans.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('LoansService', () => {
  let service: LoansService;

  let bookFindUnique: jest.Mock;
  let bookUpdate: jest.Mock;
  let userFindUnique: jest.Mock;
  let loanCreate: jest.Mock;
  let loanFindUnique: jest.Mock;
  let loanUpdate: jest.Mock;

  // Mock de $transaction sem "async" para evitar require-await;
  // ele resolve a Promise com o retorno do callback.
  let $transaction: <T>(fn: (tx: any) => Promise<T> | T) => Promise<T>;
  let prismaAny: any;

  beforeEach(() => {
    bookFindUnique = jest.fn();
    bookUpdate = jest.fn();
    userFindUnique = jest.fn();
    loanCreate = jest.fn();
    loanFindUnique = jest.fn();
    loanUpdate = jest.fn();

    $transaction = <T>(fn: (tx: any) => Promise<T> | T) =>
      Promise.resolve(fn(prismaAny));

    prismaAny = {
      book: {
        findUnique: bookFindUnique,
        update: bookUpdate,
      },
      user: {
        findUnique: userFindUnique,
      },
      loan: {
        create: loanCreate,
        findUnique: loanFindUnique,
        update: loanUpdate,
      },
      $transaction,
    };

    const prismaMock = prismaAny as unknown as PrismaService;
    service = new LoansService(prismaMock);
  });

  it('deve criar empréstimo quando livro AVAILABLE e usuário existe', async () => {
    bookFindUnique.mockResolvedValue({ id: 1, status: 'AVAILABLE' });
    userFindUnique.mockResolvedValue({ id: 1 });
    loanCreate.mockResolvedValue({ id: 10, bookId: 1, userId: 1 });

    const res = await service.createLoan(1, 1);

    expect(res.id).toBe(10);
    expect(bookUpdate).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { status: 'BORROWED' },
    });
    expect(loanCreate).toHaveBeenCalledWith({ data: { bookId: 1, userId: 1 } });
  });

  it('não deve criar empréstimo se livro não existir', async () => {
    bookFindUnique.mockResolvedValue(null);

    await expect(service.createLoan(1, 1)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('não deve criar empréstimo se livro já estiver BORROWED', async () => {
    bookFindUnique.mockResolvedValue({ id: 1, status: 'BORROWED' });

    await expect(service.createLoan(1, 1)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('deve devolver (marca returnDate e volta AVAILABLE)', async () => {
    loanFindUnique.mockResolvedValue({ id: 5, bookId: 1, returnDate: null });
    loanUpdate.mockResolvedValue({
      id: 5,
      bookId: 1,
      returnDate: new Date(),
    });

    const res = await service.returnLoan(5);

    expect(res.id).toBe(5);
    expect(bookUpdate).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { status: 'AVAILABLE' },
    });
  });

  it('não deve devolver se loan não existir', async () => {
    loanFindUnique.mockResolvedValue(null);

    await expect(service.returnLoan(99)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('não deve devolver se loan já devolvido', async () => {
    loanFindUnique.mockResolvedValue({
      id: 5,
      bookId: 1,
      returnDate: new Date(),
    });

    await expect(service.returnLoan(5)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });
});
