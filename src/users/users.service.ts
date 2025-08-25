import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(dto: { name: string; email: string }) {
    try {
      return await this.prisma.user.create({
        data: { name: dto.name, email: dto.email },
      });
    } catch (err: unknown) {
      // Prisma v4/v5/v6: erro conhecido com .code
      if (isKnownRequestError(err) && err.code === 'P2002') {
        // unique constraint
        throw new BadRequestException('Email already exists');
      }
      throw err;
    }
  }
}

// type guard para evitar "any" e agradar o ESLint/TS
function isKnownRequestError(
  e: unknown,
): e is Prisma.PrismaClientKnownRequestError {
  return (
    !!e &&
    typeof e === 'object' &&
    'code' in e &&
    // opcional, mas deixa mais restrito
    (e as Prisma.PrismaClientKnownRequestError).name ===
      'PrismaClientKnownRequestError'
  );
}
