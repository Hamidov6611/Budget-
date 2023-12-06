import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common'
import { CreateTransactionDto } from './dto/create-transaction.dto'
import { UpdateTransactionDto } from './dto/update-transaction.dto'
import { InjectRepository } from '@nestjs/typeorm'
import { Between, Repository } from 'typeorm'
import { Transaction } from './entities/transaction.entity'
@Injectable()
export class TransactionService {
	constructor(
		@InjectRepository(Transaction)
		private readonly transactionRepository: Repository<Transaction>,
	) {}

	async create(createTransactionDto: CreateTransactionDto, id: number) {
		const newTransaction = {
			title: createTransactionDto.title,
			amount: createTransactionDto.amount,
			type: createTransactionDto.type,
			user: { id },
			category: { id: +createTransactionDto.category },
		}

		if (!newTransaction)
			throw new BadRequestException('Something went wrong...')

		return await this.transactionRepository.save(newTransaction)
	}

	async findAll(id: number) {
		const transaction = await this.transactionRepository.find({
			where: {
				user: { id },
			},
			relations: {
				category: true,
			},
			order: {
				createdAt: 'DESC',
			},
		})
		return transaction
	}

	async findOne(id: number) {
		const transaction = await this.transactionRepository.findOne({
			where: {
				id,
			},
			relations: {
				user: true,
				category: true,
			},
		})
		if (!transaction) throw new NotFoundException('Transaction not found')
		return transaction
	}

	async update(id: number, updateTransactionDto: UpdateTransactionDto) {
		const transaction = await this.transactionRepository.findOne({
			where: { id },
		})

		if (!transaction) throw new NotFoundException('Transaction not found')
		return await this.transactionRepository.update(id, updateTransactionDto)
	}

	async remove(id: number) {
		const transaction = await this.transactionRepository.findOne({
			where: { id },
		})

		if (!transaction) throw new NotFoundException('Transaction not found')

		return await this.transactionRepository.delete(id)
	}

	async findAllWithPagination(id: number, page: number, limit: number) {
		const skip = (page - 1) * limit
		const transactions = await this.transactionRepository.find({
			where: {
				user: { id },
			},
			relations: {
				category: true,
				user: true,
			},
			order: {
				createdAt: 'DESC',
			},
			take: limit,
			skip: skip,
		})

		return { data: transactions }
	}

	async findAlByType(id: number, type: string) {
		const transactions = await this.transactionRepository.find({
			where: {
				user: { id },
				type,
			},
		})

		const total = transactions.reduce((acc, obj) => acc + obj.amount, 0)

		return total
	}

	async getByUser(id: number) {
		// const user = UserRepository.
	}

	async sortByType(type: string, id: number) {
		return await this.transactionRepository.find({
			where: {
				type,
				user: { id },
			},
		})
	}

	// get by Date data
	async sortByDate(start: Date, end: Date) {
		const transactions = await this.transactionRepository.find({
			where: {
				createdAt: Between(start, end),
			},
		})
		return transactions
	}
}
