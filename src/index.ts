import { DEFAULT_CONFIG } from './config';
import { ChangeCalculator } from './services/calculator';
import { FileParser } from './services/parser';
import { OutputFormatter } from './services/formatter';

function main(): void {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: npm run dev -- <input-file>');
    process.exit(1);
  }

  const filePath = args[0];
  const parser = new FileParser();
  const calculator = new ChangeCalculator(DEFAULT_CONFIG);
  const formatter = new OutputFormatter();

  try {
    const transactions = parser.parse(filePath);

    for (const transaction of transactions) {
      try {
        const change = calculator.calculate(transaction);
        console.log(formatter.format(change));
      } catch (error) {
        console.error((error as Error).message);
      }
    }
  } catch (error) {
    console.error(`Failed to read file: ${filePath}`);
    process.exit(1);
  }
}

main();
