import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
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
    category,
  }: Request): Promise<Transaction> {
    // TODO
    const transationsRepository = getCustomRepository(TransactionsRepository);

    if (type === 'outcome') {
      const balance = await transationsRepository.getBalance();

      if (value > balance.total) {
        throw new AppError('Valor extrapola valor em caixa');
      }
    }

    const categoriesRepository = getRepository(Category);

    let _category = await categoriesRepository.findOne({
      title: category,
    });

    if (!_category) {
      // cria categoria
      _category = categoriesRepository.create({
        title: category,
      });

      await categoriesRepository.save(_category);
    }

    const transaction = transationsRepository.create({
      title,
      value,
      type,
      category_id: _category.id,
    });

    await transationsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
