import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UsePipes,
	ValidationPipe,
	UseGuards,
	Req,
	Query,
} from '@nestjs/common'
import { TransactionService } from './transaction.service'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'
import { AuthorGuard } from 'src/guard/author.guard'

@Controller('transactions')
export class TransactionController {
	constructor(private readonly transactionService: TransactionService) {}

	@Post()
	// @UsePipes(new ValidationPipe())
	@UseGuards(JwtAuthGuard)
	create(@Body() createTransactionDto: CreateTransactionDto, @Req() req) {
		return this.transactionService.create(createTransactionDto, +req.user.id)
	}

	@Get('/date/:start/:end')
	sortByDate(@Param('start') start: Date, @Param('end') end: Date) {
		return this.transactionService.sortByDate(start, end)
	}

	@Get(':type/find')
	@UseGuards(JwtAuthGuard)
	findAlByType(@Req() req, @Param('type') type: string) {
		return this.transactionService.findAlByType(+req.user.id, type)
	}

	@Get('/type/:transactionType')
	@UseGuards(JwtAuthGuard)
	sortByType(@Param('transactionType') transactionType: string, @Req() req) {
		return this.transactionService.sortByType(transactionType, +req.user.id)
	}

	@Get('pagination')
	@UseGuards(JwtAuthGuard)
	findAllWithPagination(
		@Req() req,
		@Query('page') page: number,
		@Query('limit') limit: number,
	) {
		return this.transactionService.findAllWithPagination(
			+req.user.id,
			page,
			limit,
		)
	}

	@Get()
	@UseGuards(JwtAuthGuard)
	findAll(@Req() req) {
		return this.transactionService.findAll(+req.user.id)
	}

	@Get(':type/:id')
	@UseGuards(JwtAuthGuard, AuthorGuard)
	findOne(@Param('id') id: string) {
		return this.transactionService.findOne(+id)
	}

	@Patch(':type/:id')
	@UseGuards(JwtAuthGuard, AuthorGuard)
	update(
		@Param('id') id: string,
		@Body() updateTransactionDto: UpdateTransactionDto,
	) {
		return this.transactionService.update(+id, updateTransactionDto)
	}

	@Delete(':type/:id')
	@UseGuards(JwtAuthGuard, AuthorGuard)
	remove(@Param('id') id: string) {
		return this.transactionService.remove(+id)
	}
}
