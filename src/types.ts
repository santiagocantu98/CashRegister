export interface Denomination {
  name: string;
  pluralName: string;
  valueInCents: number;
}

export interface ChangeResult {
  denomination: Denomination;
  count: number;
}

export interface Transaction {
  owedCents: number;
  paidCents: number;
}

export interface AppConfig {
  randomDivisor: number;
  denominations: Denomination[];
}
