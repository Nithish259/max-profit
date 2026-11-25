import { createInterface } from 'node:readline/promises';

import { stdin as input, stdout as output } from 'node:process';

import { performance } from 'node:perf_hooks';

import {
  calculateMaxProfitBruteForce,
  calculateMaxProfitMemoized,
  calculateMaxProfitTabulated,
} from './algorithms/maxProfit.js';

import {
  parseTimeUnits,
  MAX_BRUTE_FORCE_TIME,
  MAX_MEMOIZATION_TIME,
  MAX_DP_TIME,
} from './utils/validation.js';

const ALGORITHMS = new Map([
  [
    'brute',
    {
      name: 'Brute Force',
      calculate: calculateMaxProfitBruteForce,
      maxTime: MAX_BRUTE_FORCE_TIME,
    },
  ],

  [
    'memo',
    {
      name: 'Top-Down DP (Memoization)',
      calculate: calculateMaxProfitMemoized,
      maxTime: MAX_MEMOIZATION_TIME,
    },
  ],

  [
    'dp',
    {
      name: 'Bottom-Up DP (Tabulation)',
      calculate: calculateMaxProfitTabulated,
      maxTime: MAX_DP_TIME,
    },
  ],
]);

function printHelp() {
  console.log(`
Usage:
  npm start
  npm start -- <time>
  npm start -- <time> <algorithm>

Algorithms:
  brute   Recursive brute force
  memo    Top-down dynamic programming
  dp      Bottom-up dynamic programming (default)

Examples:
  npm start -- 7
  npm start -- 13 memo
  npm start -- 21 brute
  npm start -- 10000 dp
`);
}

async function main() {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    printHelp();

    return;
  }

  let readline;

  try {
    if (args.length > 2) {
      throw new Error('Too many arguments. Use --help.');
    }

    const algorithmKey = args[1] ?? 'dp';

    const algorithm = ALGORITHMS.get(algorithmKey);

    if (!algorithm) {
      throw new Error('Invalid algorithm. Choose brute, memo or dp.');
    }

    console.log('\n========================================');

    console.log('    MARS LAND - MAXIMUM PROFIT');

    console.log('========================================\n');

    let rawInput = args[0];

    if (rawInput === undefined) {
      readline = createInterface({
        input,
        output,
      });

      rawInput = await readline.question('Enter available time units: ');
    }

    const timeUnits = parseTimeUnits(rawInput, algorithm.maxTime);

    const startTime = performance.now();

    const result = algorithm.calculate(timeUnits);

    const duration = performance.now() - startTime;

    console.log('\n----------------------------------------');

    console.log(`Time Unit: ${timeUnits}`);

    console.log(`Earnings: $${result.maxProfit}`);

    console.log('\nSolutions:');

    result.solutions.forEach((solution, index) => {
      console.log(
        `${index + 1}. ` +
          `T: ${solution.T} ` +
          `P: ${solution.P} ` +
          `C: ${solution.C}`,
      );
    });

    console.log(`\nAlgorithm: ${algorithm.name}`);

    console.log(`Execution Time: ${duration.toFixed(3)} ms`);

    console.log('----------------------------------------\n');
  } catch (error) {
    console.error(`\nError: ${error.message}`);

    process.exitCode = 1;
  } finally {
    readline?.close();
  }
}

await main();
