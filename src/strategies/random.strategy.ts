import { ChangeResult, Denomination } from '../types';
import { ChangeStrategy } from './change-strategy.interface';

export class RandomChangeStrategy implements ChangeStrategy {
  calculate(amountInCents: number, denominations: Denomination[]): ChangeResult[] {
    const result: ChangeResult[] = [];
    let remaining = amountInCents;

    const sorted = [...denominations].sort((a, b) => b.valueInCents - a.valueInCents);

    for (let i = 0; i < sorted.length; i++) {
      const denom = sorted[i];
      const maxCount = Math.floor(remaining / denom.valueInCents);

      if (maxCount === 0) continue;

      // Last denomination: take all remaining
      const isLast = i === sorted.length - 1;
      const count = isLast ? maxCount : Math.floor(Math.random() * (maxCount + 1));

      if (count > 0) {
        result.push({ denomination: denom, count });
        remaining -= count * denom.valueInCents;
      }
    }

    return result;
  }
}
