import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { LoansService } from './loans.service';
import { CreateLoanDto } from './dtos/create-loan.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Loans')
@Controller('loans')
export class LoansController {
  constructor(private loansService: LoansService) {}

  @Post()
  create(@Body() dto: CreateLoanDto) {
    return this.loansService.createLoan(dto.bookId, dto.userId);
  }

  @Patch(':id/return')
  return(@Param('id', ParseIntPipe) id: number) {
    return this.loansService.returnLoan(id);
  }
}
