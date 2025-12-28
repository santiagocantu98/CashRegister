import { FileParser } from '../../src/services/parser';

describe('FileParser', () => {
  const parser = new FileParser();

  describe('parseContent', () => {
    it('should parse valid line', () => {
      const result = parser.parseContent('2.12,3.00');
      expect(result).toHaveLength(1);
      expect(result[0].owedCents).toBe(212);
      expect(result[0].paidCents).toBe(300);
    });

    it('should parse multiple lines', () => {
      const result = parser.parseContent('2.12,3.00\n1.97,2.00\n3.33,5.00');
      expect(result).toHaveLength(3);
    });

    it('should skip empty lines', () => {
      const result = parser.parseContent('2.12,3.00\n\n1.97,2.00');
      expect(result).toHaveLength(2);
    });

    it('should handle whitespace around values', () => {
      const result = parser.parseContent(' 2.12 , 3.00 ');
      expect(result).toHaveLength(1);
      expect(result[0].owedCents).toBe(212);
      expect(result[0].paidCents).toBe(300);
    });

    it('should skip invalid format lines', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const result = parser.parseContent('invalid\n2.12,3.00');
      expect(result).toHaveLength(1);
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
    });

    it('should skip lines with non-numeric values', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      
      const result = parser.parseContent('abc,xyz\n2.12,3.00');
      expect(result).toHaveLength(1);
      
      consoleSpy.mockRestore();
    });

    it('should convert to cents correctly (avoid floating point issues)', () => {
      const result = parser.parseContent('0.10,0.20');
      expect(result[0].owedCents).toBe(10);
      expect(result[0].paidCents).toBe(20);
    });

    it('should handle README example input', () => {
      const input = '2.12,3.00\n1.97,2.00\n3.33,5.00';
      const result = parser.parseContent(input);
      
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ owedCents: 212, paidCents: 300 });
      expect(result[1]).toEqual({ owedCents: 197, paidCents: 200 });
      expect(result[2]).toEqual({ owedCents: 333, paidCents: 500 });
    });

    it('should handle negative numbers (converts to cents as-is)', () => {
      const result = parser.parseContent('-1.00,2.00');
      expect(result).toHaveLength(1);
      expect(result[0].owedCents).toBe(-100);
      expect(result[0].paidCents).toBe(200);
    });

    it('should round decimals with more than 2 places', () => {
      const result = parser.parseContent('1.999,2.001');
      expect(result).toHaveLength(1);
      expect(result[0].owedCents).toBe(200);
      expect(result[0].paidCents).toBe(200);
    });

    it('should handle Windows line endings (CRLF)', () => {
      const result = parser.parseContent('2.12,3.00\r\n1.97,2.00\r\n3.33,5.00');
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ owedCents: 212, paidCents: 300 });
      expect(result[1]).toEqual({ owedCents: 197, paidCents: 200 });
      expect(result[2]).toEqual({ owedCents: 333, paidCents: 500 });
    });
  });
});

