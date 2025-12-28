import * as fs from 'fs';
import { Transaction } from '../types';

export class FileParser {
  parse(filePath: string): Transaction[] {
    const content = fs.readFileSync(filePath, 'utf-8');
    return this.parseContent(content);
  }

  parseContent(content: string): Transaction[] {
    const lines = content.split(/\r?\n/);
    const transactions: Transaction[] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      if (!line) continue;

      const transaction = this.parseLine(line, i + 1);
      if (transaction) {
        transactions.push(transaction);
      }
    }

    return transactions;
  }

  private parseLine(line: string, lineNumber: number): Transaction | null {
    const parts = line.split(',');

    if (parts.length !== 2) {
      console.error(`Line ${lineNumber}: Invalid format "${line}"`);
      return null;
    }

    const owed = parseFloat(parts[0].trim());
    const paid = parseFloat(parts[1].trim());

    if (isNaN(owed) || isNaN(paid)) {
      console.error(`Line ${lineNumber}: Invalid numbers "${line}"`);
      return null;
    }

    // Convert to cents to avoid floating-point issues
    const owedCents = Math.round(owed * 100);
    const paidCents = Math.round(paid * 100);

    return { owedCents, paidCents };
  }
}
