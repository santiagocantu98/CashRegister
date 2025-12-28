# Cash Register

## The Problem
Creative Cash Draw Solutions is a client who wants to provide something different for the cashiers who use their system. The function of the application is to tell the cashier how much change is owed, and what denominations should be used. In most cases the app should return the minimum amount of physical change, but the client would like to add a twist. If the "owed" amount is divisible by 3, the app should randomly generate the change denominations (but the math still needs to be right :))

Please write a program which accomplishes the clients goals. The program should:

1. Accept a flat file as input
	1. Each line will contain the amount owed and the amount paid separated by a comma (for example: 2.13,3.00)
	2. Expect that there will be multiple lines
2. Output the change the cashier should return to the customer
	1. The return string should look like: 1 dollar,2 quarters,1 nickel, etc ...
	2. Each new line in the input file should be a new line in the output file

## Sample Input
2.12,3.00

1.97,2.00

3.33,5.00

## Sample Output
3 quarters,1 dime,3 pennies

3 pennies

1 dollar,1 quarter,6 nickels,12 pennies

*Remember the last one is random

## The Fine Print
Please use whatever technology and techniques you feel are applicable to solve the problem. We suggest that you approach this exercise as if this code was part of a larger system. The end result should be representative of your abilities and style.

Please fork this repository. When you have completed your solution, please issue a pull request to notify us that you are ready.

Have fun.

## Things To Consider
Here are a couple of thoughts about the domain that could influence your response:

* What might happen if the client needs to change the random divisor?
* What might happen if the client needs to add another special case (like the random twist)?
* What might happen if sales closes a new client in France?

---

# Solution

## Quick Start

```bash
# Install dependencies
npm install

# Run with sample input
npm run dev -- input.txt

# Run tests
npm test
```

## Usage

```bash
npm run dev -- <input-file>
```

**Example:**
```bash
$ npm run dev -- input.txt
3 quarters,1 dime,3 pennies
3 pennies
1 dollar,1 quarter,4 dimes,2 pennies
```

## Project Structure

```
src/
├── config/           # Denominations and app configuration
├── strategies/       # Change calculation algorithms
│   ├── minimal.strategy.ts   # Greedy algorithm (minimum coins)
│   └── random.strategy.ts    # Random valid distribution
├── services/
│   ├── calculator.ts   # Orchestrates strategy selection
│   ├── parser.ts       # Parses input file
│   └── formatter.ts    # Formats output string
└── index.ts          # CLI entry point
```

## Design Decisions

### Addressing "Things To Consider"

| Question | Solution |
|----------|----------|
| Change the random divisor? | `randomDivisor` is configurable in `config/index.ts` |
| Add another special case? | Implement a new `ChangeStrategy` and update the factory logic in `calculator.ts` |
| Client in France? | Add new denominations in `config/` — the algorithms work with any denomination set |

### Technical Decisions

- **Integer arithmetic**: All calculations use cents (integers) to avoid floating-point precision issues
- **Strategy Pattern**: Allows swapping change algorithms without modifying core logic
- **No half-dollar**: Excluded to match the expected output in the README examples

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage
```

**Test coverage:**
- Unit tests for each strategy, service, and utility
- Integration tests for README examples
- Edge cases: exact payment, insufficient payment, invalid input, negative amounts

## Error Handling

| Input | Behavior |
|-------|----------|
| Invalid format (`abc,xyz`) | Line skipped, error logged to stderr |
| Insufficient payment (`5.00,3.00`) | Error thrown with descriptive message |
| Negative amounts (`-1.00,2.00`) | Error thrown: "amounts cannot be negative" |
| Empty lines | Skipped silently |
| Windows line endings (`\r\n`) | Supported |

## Technologies

- TypeScript
- Node.js
- Jest (testing)