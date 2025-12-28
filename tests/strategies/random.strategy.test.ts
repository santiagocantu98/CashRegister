import { RandomChangeStrategy } from '../../src/strategies/random.strategy';
import { USD_DENOMINATIONS } from '../../src/config';

describe('RandomChangeStrategy', () => {
  const strategy = new RandomChangeStrategy();

  it('should return empty array for zero cents', () => {
    const result = strategy.calculate(0, USD_DENOMINATIONS);
    expect(result).toEqual([]);
  });

  it('should always return correct total for 167 cents (README example 3)', () => {
    // Run multiple times to account for randomness
    for (let i = 0; i < 20; i++) {
      const result = strategy.calculate(167, USD_DENOMINATIONS);
      const total = result.reduce((sum, r) => sum + r.count * r.denomination.valueInCents, 0);
      expect(total).toBe(167);
    }
  });

  it('should always return correct total for various amounts', () => {
    const amounts = [1, 5, 10, 25, 50, 100, 88, 167, 999];

    for (const amount of amounts) {
      const result = strategy.calculate(amount, USD_DENOMINATIONS);
      const total = result.reduce((sum, r) => sum + r.count * r.denomination.valueInCents, 0);
      expect(total).toBe(amount);
    }
  });

  it('should produce varied outputs (actually random)', () => {
    const outputs = new Set<string>();

    // Run 50 times and check we get at least some variation
    for (let i = 0; i < 50; i++) {
      const result = strategy.calculate(167, USD_DENOMINATIONS);
      outputs.add(JSON.stringify(result));
    }

    // Should have at least 2 different outputs (very likely with random)
    expect(outputs.size).toBeGreaterThan(1);
  });

  it('should only return denominations with positive counts', () => {
    for (let i = 0; i < 20; i++) {
      const result = strategy.calculate(167, USD_DENOMINATIONS);
      for (const r of result) {
        expect(r.count).toBeGreaterThan(0);
      }
    }
  });
});

