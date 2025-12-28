import { ChangeResult, Denomination } from '../types';

export interface ChangeStrategy {
  /**
   * Calculate change for a given amount
   * @param amountInCents - The amount of change to calculate
   * @param denominations - Available denominations to use
   * @returns Array of denominations and their counts
   */
  calculate(amountInCents: number, denominations: Denomination[]): ChangeResult[];
}
