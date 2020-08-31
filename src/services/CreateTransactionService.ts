import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import CategoriesRepository from '../repositories/CategoriesRepository';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}
class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category: categoryTitle,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    if (type === 'outcome') {
      const { total } = await transactionsRepository.getBalance();
      if (total < value) throw new AppError('Sem valor em caixa');
    }

    const categoriesRepository = getCustomRepository(CategoriesRepository);

    const category = await categoriesRepository.findOneOrCreateByTitle(
      categoryTitle,
    );

    const transaction = new Transaction();
    Object.assign(transaction, {
      title,
      value,
      type,
      category_id: category.id,
      category,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
