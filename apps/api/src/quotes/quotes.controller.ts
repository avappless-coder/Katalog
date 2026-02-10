import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { QuotesService } from './quotes.service';
import { CreateUserQuoteDto } from './dto/create-user-quote.dto';
import { UpdateUserQuoteDto } from './dto/update-user-quote.dto';
import { CreateGlobalQuoteDto } from './dto/create-global-quote.dto';

@Controller('quotes')
export class QuotesController {
  constructor(private readonly quotes: QuotesService) {}

  @Get('global')
  async listGlobal(@Query('sort') sort?: string) {
    return this.quotes.listGlobal(sort);
  }

  @Post('global')
  @UseGuards(JwtAuthGuard)
  async createGlobal(
    @CurrentUser() user: { id: string },
    @Body() dto: CreateGlobalQuoteDto
  ) {
    return this.quotes.createGlobal(user.id, dto);
  }

  @Post('global/:id/like')
  @UseGuards(JwtAuthGuard)
  async like(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.quotes.like(user.id, id);
  }

  @Delete('global/:id/like')
  @UseGuards(JwtAuthGuard)
  async unlike(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.quotes.unlike(user.id, id);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async listMine(@CurrentUser() user: { id: string }) {
    return this.quotes.listUserQuotes(user.id);
  }

  @Post('me')
  @UseGuards(JwtAuthGuard)
  async createMine(@CurrentUser() user: { id: string }, @Body() dto: CreateUserQuoteDto) {
    return this.quotes.createUserQuote(user.id, dto);
  }

  @Patch('me/:id')
  @UseGuards(JwtAuthGuard)
  async updateMine(
    @CurrentUser() user: { id: string },
    @Param('id') id: string,
    @Body() dto: UpdateUserQuoteDto
  ) {
    return this.quotes.updateUserQuote(user.id, id, dto);
  }

  @Delete('me/:id')
  @UseGuards(JwtAuthGuard)
  async removeMine(@CurrentUser() user: { id: string }, @Param('id') id: string) {
    return this.quotes.deleteUserQuote(user.id, id);
  }
}