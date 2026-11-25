import { BUILDINGS } from '../config/buildings.js';

import { validateTimeUnits } from '../utils/validation.js';

/**
 * Calculates maximum earnings using recursive backtracking.
 *
 * @param {number} timeUnits
 * @returns {{
 *   maxProfit: number,
 *   solutions: Array<{T: number, P: number, C: number}>
 * }}
 */
export function calculateMaxProfitBruteForce(timeUnits) {
  validateTimeUnits(timeUnits);

  let maxProfit = 0;

  const solutions = new Map();

  const counts = {
    T: 0,
    P: 0,
    C: 0,
  };

  function backtrack(remainingTime, currentProfit) {
    const key = `${counts.T},${counts.P},${counts.C}`;

    // A better solution has been discovered.
    if (currentProfit > maxProfit) {
      maxProfit = currentProfit;

      solutions.clear();

      solutions.set(key, { ...counts });
    }

    // Another equally optimal solution.
    else if (currentProfit === maxProfit) {
      solutions.set(key, { ...counts });
    }

    // Explore every establishment type.
    for (const building of BUILDINGS) {
      // Skip construction that cannot earn revenue.
      if (remainingTime <= building.buildTime) {
        continue;
      }

      const nextRemainingTime = remainingTime - building.buildTime;

      const earnings = nextRemainingTime * building.earningsPerUnit;

      // Choose.
      counts[building.type]++;

      // Explore.
      backtrack(nextRemainingTime, currentProfit + earnings);

      // Undo.
      counts[building.type]--;
    }
  }

  backtrack(timeUnits, 0);

  return {
    maxProfit,
    solutions: [...solutions.values()],
  };
}
