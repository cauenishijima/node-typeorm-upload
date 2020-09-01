import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    // TODO
    const { income } = await this.createQueryBuilder('transactions')
      .select('SUM(transactions.value + 0)', 'income')
      .where('type = :vartype', { vartype: 'income' })
      .getRawOne();

    const { outcome } = await this.createQueryBuilder('transactions')
      .select('SUM(transactions.value + 0)', 'outcome')
      .where('type = :vartype', { vartype: 'outcome' })
      .getRawOne();

    const balance: Balance = {
      income: Number(income),
      outcome: Number(outcome),
      total: income - outcome,
    };

    return balance;
  }
}

export default TransactionsRepository;
