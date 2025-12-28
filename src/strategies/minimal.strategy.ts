import { ChangeResult, Denomination } from '../types';
import { ChangeStrategy } from './change-strategy.interface';

export class MinimalChangeStrategy implements ChangeStrategy {
  calculate(amountInCents: number, denominations: Denomination[]): ChangeResult[] {
    const result: ChangeResult[] = [];
    let remaining = amountInCents;

    const sorted = [...denominations].sort((a, b) => b.valueInCents - a.valueInCents);

    for (const denom of sorted) {
      if (remaining >= denom.valueInCents) {
        const count = Math.floor(remaining / denom.valueInCents);
        result.push({ denomination: denom, count });
        remaining -= count * denom.valueInCents;
      }

      if (remaining === 0) break;
    }

    return result;
  }
}
