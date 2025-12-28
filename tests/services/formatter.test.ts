import { OutputFormatter } from '../../src/services/formatter';
import { ChangeResult } from '../../src/types';

describe('OutputFormatter', () => {
  const formatter = new OutputFormatter();

  const makeDenom = (name: string, pluralName: string, valueInCents: number) => ({
    name,
    pluralName,
    valueInCents,
  });

  it('should return empty string for empty results', () => {
    const result = formatter.format([]);
    expect(result).toBe('');
  });

  it('should format single denomination singular', () => {
    const results: ChangeResult[] = [
      { denomination: makeDenom('dollar', 'dollars', 100), count: 1 },
    ];
    expect(formatter.format(results)).toBe('1 dollar');
  });

  it('should format single denomination plural', () => {
    const results: ChangeResult[] = [
      { denomination: makeDenom('dollar', 'dollars', 100), count: 3 },
    ];
    expect(formatter.format(results)).toBe('3 dollars');
  });

  it('should format multiple denominations with commas', () => {
    const results: ChangeResult[] = [
      { denomination: makeDenom('quarter', 'quarters', 25), count: 3 },
      { denomination: makeDenom('dime', 'dimes', 10), count: 1 },
      { denomination: makeDenom('penny', 'pennies', 1), count: 3 },
    ];
    expect(formatter.format(results)).toBe('3 quarters,1 dime,3 pennies');
  });

  it('should handle penny singular/plural correctly', () => {
    const penny = makeDenom('penny', 'pennies', 1);
    
    expect(formatter.format([{ denomination: penny, count: 1 }])).toBe('1 penny');
    expect(formatter.format([{ denomination: penny, count: 5 }])).toBe('5 pennies');
  });

  it('should format README example 1 correctly', () => {
    const results: ChangeResult[] = [
      { denomination: makeDenom('quarter', 'quarters', 25), count: 3 },
      { denomination: makeDenom('dime', 'dimes', 10), count: 1 },
      { denomination: makeDenom('penny', 'pennies', 1), count: 3 },
    ];
    expect(formatter.format(results)).toBe('3 quarters,1 dime,3 pennies');
  });

  it('should format README example 2 correctly', () => {
    const results: ChangeResult[] = [
      { denomination: makeDenom('penny', 'pennies', 1), count: 3 },
    ];
    expect(formatter.format(results)).toBe('3 pennies');
  });
});

