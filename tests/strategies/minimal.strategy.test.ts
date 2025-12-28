import { MinimalChangeStrategy } from '../../src/strategies/minimal.strategy';
import { USD_DENOMINATIONS } from '../../src/config';

describe('MinimalChangeStrategy', () => {
  const strategy = new MinimalChangeStrategy();

  it('should return empty array for zero cents', () => {
    const result = strategy.calculate(0, USD_DENOMINATIONS);
    expect(result).toEqual([]);
  });

  it('should return 3 pennies for 3 cents', () => {
    const result = strategy.calculate(3, USD_DENOMINATIONS);
    expect(result).toHaveLength(1);
    expect(result[0].denomination.name).toBe('penny');
    expect(result[0].count).toBe(3);
  });

  it('should return 1 nickel for 5 cents', () => {
    const result = strategy.calculate(5, USD_DENOMINATIONS);
    expect(result).toHaveLength(1);
    expect(result[0].denomination.name).toBe('nickel');
    expect(result[0].count).toBe(1);
  });

  it('should return 1 dime for 10 cents', () => {
    const result = strategy.calculate(10, USD_DENOMINATIONS);
    expect(result).toHaveLength(1);
    expect(result[0].denomination.name).toBe('dime');
    expect(result[0].count).toBe(1);
  });

  it('should return 1 quarter for 25 cents', () => {
    const result = strategy.calculate(25, USD_DENOMINATIONS);
    expect(result).toHaveLength(1);
    expect(result[0].denomination.name).toBe('quarter');
    expect(result[0].count).toBe(1);
  });

  it('should return 1 dollar for 100 cents', () => {
    const result = strategy.calculate(100, USD_DENOMINATIONS);
    expect(result).toHaveLength(1);
    expect(result[0].denomination.name).toBe('dollar');
    expect(result[0].count).toBe(1);
  });

  it('should return correct change for 88 cents (README example 1)', () => {
    const result = strategy.calculate(88, USD_DENOMINATIONS);
    
    const total = result.reduce((sum, r) => sum + r.count * r.denomination.valueInCents, 0);
    expect(total).toBe(88);

    // Should be 3 quarters, 1 dime, 3 pennies
    expect(result).toHaveLength(3);
    expect(result[0].denomination.name).toBe('quarter');
    expect(result[0].count).toBe(3);
    expect(result[1].denomination.name).toBe('dime');
    expect(result[1].count).toBe(1);
    expect(result[2].denomination.name).toBe('penny');
    expect(result[2].count).toBe(3);
  });

  it('should return minimum number of coins', () => {
    // 41 cents should be 1 quarter, 1 dime, 1 nickel, 1 penny = 4 coins
    const result = strategy.calculate(41, USD_DENOMINATIONS);
    const totalCoins = result.reduce((sum, r) => sum + r.count, 0);
    expect(totalCoins).toBe(4);
  });

  it('should handle large amounts', () => {
    const result = strategy.calculate(999, USD_DENOMINATIONS);
    const total = result.reduce((sum, r) => sum + r.count * r.denomination.valueInCents, 0);
    expect(total).toBe(999);
  });
});

