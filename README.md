# Mars Land — Maximum Profit Optimizer

A dependency-free Node.js command-line application that calculates maximum achievable earnings by optimizing sequential property construction within a given time budget.

Developed for the Everquint Full Stack Developer Interview Assessment.

## Problem Statement

Mr. X owns unlimited land and can construct theatres, pubs and commercial parks. Only one property can be under construction at any given time. Completed properties generate revenue during their remaining operational time.

The objective is to maximize total earnings and return all unique optimal building-count combinations.

## Building Configuration

| Establishment | Construction Time | Earnings per Time Unit |
|---|---:|---:|
| Theatre (T) | 5 | $1500 |
| Pub (P) | 4 | $1000 |
| Commercial Park (C) | 10 | $2000 |

## Features

- Recursive brute-force algorithm with backtracking.
- Top-down dynamic programming with memoization.
- Bottom-up dynamic programming with tabulation.
- Reconstruction of all unique optimal building combinations.
- Deterministic solution ordering.
- Interactive CLI and command-line argument support.
- Algorithm selection.
- Execution-time measurement.
- Input validation and algorithm-specific limits.
- Automated unit, regression and CLI integration tests.
- Zero external dependencies.

## Prerequisites

- Node.js 20 or later
- npm

## Installation

```bash
npm ci
```

## Usage

### Interactive Mode

```bash
npm start
```

### Command-Line Mode

```bash
npm start -- 13
```

### Algorithm Selection

```bash
npm start -- 21 brute
npm start -- 21 memo
npm start -- 21 dp
```

Bottom-up dynamic programming is the default algorithm.

### Help

```bash
npm start -- --help
```

## Example Output

```text
Time Unit: 7
Earnings: $3000

Solutions:
1. T: 1 P: 0 C: 0
2. T: 0 P: 1 C: 0

Algorithm: Bottom-Up DP (Tabulation)
```

The CLI also displays measured execution time, which varies by environment.

## Official Assignment Test Cases

| Time Units | Maximum Earnings | Optimal Combinations |
|---:|---:|---|
| 7 | $3000 | T:1 P:0 C:0 or T:0 P:1 C:0 |
| 8 | $4500 | T:1 P:0 C:0 |
| 13 | $16500 | T:2 P:0 C:0 |

## Algorithm Design

### Brute Force

Recursively explores every profitable construction sequence. Backtracking restores the current building counts after each recursive branch.

A Map stores unique optimal building-count combinations.

### Top-Down Dynamic Programming

Recursively calculates the maximum additional earnings for a given remaining-time budget. A memoization cache stores previously computed answers.

### Bottom-Up Dynamic Programming

Computes maximum earnings iteratively from zero through the requested time budget.

Previously calculated states are reused without recursion.

### Recurrence

For a remaining-time budget n:

```text
F(n) = max(
    0,
    rate × (n - buildTime) + F(n - buildTime)
)
```

Each establishment is considered only when its construction leaves positive operational time.

### Solution Reconstruction

After computing maximum earnings, the optimized algorithms follow only construction decisions whose earnings match the optimal recurrence.

An explicit stack performs depth-first exploration. A visited Set prevents repeated exploration of identical reconstruction states, and a Map eliminates duplicate building-count combinations.

Solutions are sorted deterministically by descending theatre, pub and commercial park counts.

## Complexity Analysis

| Algorithm | Earnings Calculation Time | Earnings Calculation Space |
|---|---|---|
| Brute Force | Exponential upper bound O(3^(n/4)) | O(n) recursion stack |
| Memoization | O(n) | O(n) |
| Tabulation | O(n) | O(n) |

Solution reconstruction and storage introduce additional costs depending on the number of optimal states and unique combinations.

Bottom-up dynamic programming is used by default because it avoids recursive stack growth during earnings calculation.

## Input Limits

| Algorithm | Maximum Time Units |
|---|---:|
| Brute Force | 50 |
| Memoization | 1000 |
| Tabulation | 10000 |

These are implementation safeguards rather than restrictions specified by the original problem.

## Testing

```bash
npm test
```

The test suite covers:

- Building configuration and immutability.
- All official assignment examples.
- Boundary conditions and multiple optimal solutions.
- Invalid inputs and algorithm-specific limits.
- Cross-algorithm comparison for every time budget from 0 through 50.
- Optimized algorithm comparison on larger inputs.
- Solution deduplication and time-budget constraints.
- Independent verification of returned solution earnings.
- Large-input execution.
- CLI integration and error handling.

## Project Structure

```text
max-profit/
├── src/
│   ├── algorithms/
│   │   └── maxProfit.js
│   ├── config/
│   │   └── buildings.js
│   ├── utils/
│   │   └── validation.js
│   └── main.js
├── tests/
│   └── maxProfit.test.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

## Assumptions and Limitations

- Time units are non-negative integers.
- Land capacity is unlimited.
- Only one establishment can be under construction at any time.
- Completed establishments continue generating revenue during subsequent construction.
- No construction or operational costs are specified.
- Construction completed exactly at the deadline is excluded because it generates no earnings.
- All unique optimal profitable building-count combinations are returned rather than every equivalent construction sequence.
- Execution-time measurements are environment-dependent and are not formal benchmark results.
- The application is intentionally CLI-based because the assignment does not require a frontend.

## Author

Nithish P