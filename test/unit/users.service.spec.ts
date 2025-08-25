import { UsersService } from '../../src/users/users.service';
import { PrismaService } from '../../src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { BadRequestException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let userCreate: jest.Mock;

  beforeEach(() => {
    userCreate = jest.fn();

    const prismaMock = {
      user: {
        create: userCreate,
      },
    } as unknown as PrismaService;

    service = new UsersService(prismaMock);
  });

  it('deve criar usuário', async () => {
    userCreate.mockResolvedValue({
      id: 1,
      name: 'Ana',
      email: 'ana@example.com',
    });

    const result = await service.create({
      name: 'Ana',
      email: 'ana@example.com',
    });

    expect(result).toEqual({ id: 1, name: 'Ana', email: 'ana@example.com' });
    expect(userCreate).toHaveBeenCalledWith({
      data: { name: 'Ana', email: 'ana@example.com' },
    });
  });

  it('deve lançar BadRequestException em email duplicado (P2002)', async () => {
    // Simula um PrismaClientKnownRequestError minimalista
    const err = {
      code: 'P2002',
      clientVersion: 'x',
      name: 'PrismaClientKnownRequestError',
    } as unknown as Prisma.PrismaClientKnownRequestError;

    userCreate.mockRejectedValue(err);

    await expect(
      service.create({ name: 'Ana', email: 'ana@example.com' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
