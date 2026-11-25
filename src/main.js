import { createInterface } from 'node:readline/promises';

import { stdin as input, stdout as output } from 'node:process';

import { calculateMaxProfitBruteForce } from './algorithms/maxProfit.js';

import { parseTimeUnits } from './utils/validation.js';

async function main() {
  const readline = createInterface({
    input,
    output,
  });

  try {
    console.log('\n========================================');

    console.log('    MARS LAND - MAXIMUM PROFIT');

    console.log('========================================\n');

    const rawInput =
      process.argv[2] ??
      (await readline.question('Enter available time units: '));

    const timeUnits = parseTimeUnits(rawInput);

    const result = calculateMaxProfitBruteForce(timeUnits);

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

    console.log('----------------------------------------\n');
  } catch (error) {
    console.error(`\nError: ${error.message}`);

    process.exitCode = 1;
  } finally {
    readline.close();
  }
}

await main();
