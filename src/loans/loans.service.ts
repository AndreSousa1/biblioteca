import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LoansService {
  constructor(private prisma: PrismaService) {}

  // POST /loans
  async createLoan(bookId: number, userId: number) {
    const book = await this.prisma.book.findUnique({ where: { id: bookId } });
    if (!book) throw new NotFoundException('Book not found');
    if (book.status !== 'AVAILABLE') {
      throw new BadRequestException('Book is already borrowed');
    }

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.$transaction(async (tx) => {
      const loan = await tx.loan.create({
        data: { bookId, userId },
      });
      await tx.book.update({
        where: { id: bookId },
        data: { status: 'BORROWED' },
      });
      return loan;
    });
  }

  // PATCH /loans/:id/return
  async returnLoan(loanId: number) {
    const loan = await this.prisma.loan.findUnique({ where: { id: loanId } });
    if (!loan) throw new NotFoundException('Loan not found');
    if (loan.returnDate) throw new BadRequestException('Loan already returned');

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.loan.update({
        where: { id: loanId },
        data: { returnDate: new Date() },
      });
      await tx.book.update({
        where: { id: loan.bookId },
        data: { status: 'AVAILABLE' },
      });
      return updated;
    });
  }
}
