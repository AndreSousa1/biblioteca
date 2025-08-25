import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { BooksModule } from './books/books.module';
import { UsersModule } from './users/users.module';
import { LoansModule } from './loans/loans.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [PrismaModule, BooksModule, UsersModule, LoansModule, HealthModule],
})
export class AppModule {}
