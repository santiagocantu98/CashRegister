import { ChangeCalculator } from '../src/services/calculator';
import { FileParser } from '../src/services/parser';
import { OutputFormatter } from '../src/services/formatter';
import { DEFAULT_CONFIG } from '../src/config';

describe('Integration Tests', () => {
  const parser = new FileParser();
  const calculator = new ChangeCalculator(DEFAULT_CONFIG);
  const formatter = new OutputFormatter();

  function processInput(content: string): string[] {
    const transactions = parser.parseContent(content);
    return transactions.map((t) => {
      const change = calculator.calculate(t);
      return formatter.format(change);
    });
  }

  describe('README examples', () => {
    it('should process example 1: 2.12,3.00 → 3 quarters,1 dime,3 pennies', () => {
      const output = processInput('2.12,3.00');
      expect(output[0]).toBe('3 quarters,1 dime,3 pennies');
    });

    it('should process example 2: 1.97,2.00 → 3 pennies', () => {
      const output = processInput('1.97,2.00');
      expect(output[0]).toBe('3 pennies');
    });

    it('should process example 3: 3.33,5.00 → random but correct total', () => {
      const output = processInput('3.33,5.00');
      
      // Parse the output and verify total
      const parts = output[0].split(',');
      let total = 0;
      
      for (const part of parts) {
        const match = part.match(/(\d+)\s+(\w+)/);
        if (match) {
          const count = parseInt(match[1]);
          const name = match[2];
          
          const values: Record<string, number> = {
            dollar: 100, dollars: 100,
            quarter: 25, quarters: 25,
            dime: 10, dimes: 10,
            nickel: 5, nickels: 5,
            penny: 1, pennies: 1,
          };
          
          total += count * (values[name] || 0);
        }
      }
      
      expect(total).toBe(167);
    });

    it('should process all README examples together', () => {
      const input = '2.12,3.00\n1.97,2.00\n3.33,5.00';
      const output = processInput(input);
      
      expect(output).toHaveLength(3);
      expect(output[0]).toBe('3 quarters,1 dime,3 pennies');
      expect(output[1]).toBe('3 pennies');
      // Third is random, just verify we got something
      expect(output[2].length).toBeGreaterThan(0);
    });
  });

  describe('Edge cases', () => {
    it('should handle exact payment (no change)', () => {
      const output = processInput('5.00,5.00');
      expect(output[0]).toBe('');
    });

    it('should handle $1 change', () => {
      const output = processInput('4.00,5.00');
      expect(output[0]).toBe('1 dollar');
    });

    it('should handle large change amounts', () => {
      const output = processInput('0.01,10.00');
      // 999 cents = 9 dollars, 3 quarters, 2 dimes, 4 pennies
      expect(output[0]).toContain('dollar');
    });

    it('should skip invalid lines and continue', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const output = processInput('invalid\n2.12,3.00');
      expect(output).toHaveLength(1);
      expect(output[0]).toBe('3 quarters,1 dime,3 pennies');
      
      consoleSpy.mockRestore();
    });
  });
});

