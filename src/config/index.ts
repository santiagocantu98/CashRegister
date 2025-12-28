import { AppConfig, Denomination } from '../types';

export const USD_DENOMINATIONS: Denomination[] = [
  { name: 'dollar', pluralName: 'dollars', valueInCents: 100 },
  { name: 'quarter', pluralName: 'quarters', valueInCents: 25 },
  { name: 'dime', pluralName: 'dimes', valueInCents: 10 },
  { name: 'nickel', pluralName: 'nickels', valueInCents: 5 },
  { name: 'penny', pluralName: 'pennies', valueInCents: 1 },
];

export const DEFAULT_CONFIG: AppConfig = {
  randomDivisor: 3,
  denominations: USD_DENOMINATIONS,
};

export { AppConfig, Denomination } from '../types';
