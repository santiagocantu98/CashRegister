import { ChangeResult, Transaction, AppConfig } from '../types';
import { ChangeStrategy, MinimalChangeStrategy, RandomChangeStrategy } from '../strategies';

export class ChangeCalculator {
  private readonly config: AppConfig;

  constructor(config: AppConfig) {
    this.config = config;
  }

  calculate(transaction: Transaction): ChangeResult[] {
    if (transaction.owedCents < 0 || transaction.paidCents < 0) {
      throw new Error(`Invalid transaction: amounts cannot be negative`);
    }

    const changeInCents = transaction.paidCents - transaction.owedCents;

    if (changeInCents < 0) {
      throw new Error(`Insufficient payment: owed ${transaction.owedCents}, paid ${transaction.paidCents}`);
    }

    if (changeInCents === 0) {
      return [];
    }

    const strategy = this.selectStrategy(transaction.owedCents);
    return strategy.calculate(changeInCents, this.config.denominations);
  }

  private selectStrategy(owedCents: number): ChangeStrategy {
    const useRandom = owedCents % this.config.randomDivisor === 0;
    return useRandom ? new RandomChangeStrategy() : new MinimalChangeStrategy();
  }
}
