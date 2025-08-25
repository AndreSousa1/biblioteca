import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dtos/create-book.dto';
import { UpdateBookStatusDto } from './dtos/update-book-status.dto';
import { BookStatus } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Books')
@Controller('books')
export class BooksController {
  constructor(private booksService: BooksService) {}

  @Post()
  create(@Body() dto: CreateBookDto) {
    return this.booksService.create(dto);
  }

  @Get()
  findAll(@Query('status') status?: BookStatus, @Query('q') q?: string) {
    return this.booksService.findAll(status, q);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateBookStatusDto,
  ) {
    return this.booksService.updateStatus(id, dto);
  }
}
