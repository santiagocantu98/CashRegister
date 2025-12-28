import { ChangeResult } from '../types';

export class OutputFormatter {
  format(results: ChangeResult[]): string {
    if (results.length === 0) {
      return '';
    }

    return results
      .map((r) => this.formatDenomination(r))
      .join(',');
  }

  private formatDenomination(result: ChangeResult): string {
    const { denomination, count } = result;
    const name = count === 1 ? denomination.name : denomination.pluralName;
    return `${count} ${name}`;
  }
}
