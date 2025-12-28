import { ChangeCalculator } from '../../src/services/calculator';
import { DEFAULT_CONFIG } from '../../src/config';

describe('ChangeCalculator', () => {
  const calculator = new ChangeCalculator(DEFAULT_CONFIG);

  describe('calculate', () => {
    it('should return empty array when no change is owed', () => {
      const result = calculator.calculate({ owedCents: 500, paidCents: 500 });
      expect(result).toEqual([]);
    });

    it('should throw error for insufficient payment', () => {
      expect(() => {
        calculator.calculate({ owedCents: 500, paidCents: 300 });
      }).toThrow('Insufficient payment');
    });

    it('should throw error for negative owed amount (invalid input)', () => {
      expect(() => {
        calculator.calculate({ owedCents: -100, paidCents: 200 });
      }).toThrow();
    });

    it('should use minimal strategy when owed is NOT divisible by 3', () => {
      // 212 % 3 = 2 (not divisible)
      const result = calculator.calculate({ owedCents: 212, paidCents: 300 });
      
      // Should return minimal change (greedy)
      expect(result[0].denomination.name).toBe('quarter');
      expect(result[0].count).toBe(3);
    });

    it('should use random strategy when owed IS divisible by 3', () => {
      // 333 % 3 = 0 (divisible)
      // Run multiple times - should always sum correctly
      for (let i = 0; i < 10; i++) {
        const result = calculator.calculate({ owedCents: 333, paidCents: 500 });
        const total = result.reduce((sum, r) => sum + r.count * r.denomination.valueInCents, 0);
        expect(total).toBe(167);
      }
    });

    it('should calculate README example 1 correctly', () => {
      const result = calculator.calculate({ owedCents: 212, paidCents: 300 });
      const total = result.reduce((sum, r) => sum + r.count * r.denomination.valueInCents, 0);
      expect(total).toBe(88);
    });

    it('should calculate README example 2 correctly', () => {
      const result = calculator.calculate({ owedCents: 197, paidCents: 200 });
      expect(result).toHaveLength(1);
      expect(result[0].denomination.name).toBe('penny');
      expect(result[0].count).toBe(3);
    });
  });

  describe('custom config', () => {
    it('should respect custom random divisor', () => {
      const customCalculator = new ChangeCalculator({
        ...DEFAULT_CONFIG,
        randomDivisor: 5,
      });

      // 500 % 5 = 0 → random strategy
      // 501 % 5 = 1 → minimal strategy
      const result1 = customCalculator.calculate({ owedCents: 500, paidCents: 600 });
      const result2 = customCalculator.calculate({ owedCents: 501, paidCents: 600 });
      
      expect(result1.reduce((sum, r) => sum + r.count * r.denomination.valueInCents, 0)).toBe(100);
      expect(result2.reduce((sum, r) => sum + r.count * r.denomination.valueInCents, 0)).toBe(99);
    });
  });
});

