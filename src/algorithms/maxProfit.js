import { BUILDINGS } from '../config/buildings.js';

import {
  validateTimeUnits,
  MAX_BRUTE_FORCE_TIME,
  MAX_MEMOIZATION_TIME,
  MAX_DP_TIME,
} from '../utils/validation.js';

// ==========================================
// SHARED HELPERS
// ==========================================

function createEmptyCounts() {
  return {
    T: 0,
    P: 0,
    C: 0,
  };
}

function getCombinationKey(counts) {
  return `${counts.T},${counts.P},${counts.C}`;
}

function sortSolutions(solutions) {
  return [...solutions].sort((a, b) => b.T - a.T || b.P - a.P || b.C - a.C);
}

// ==========================================
// APPROACH 1: BRUTE FORCE
// ==========================================

export function calculateMaxProfitBruteForce(timeUnits) {
  validateTimeUnits(timeUnits, MAX_BRUTE_FORCE_TIME);

  let maxProfit = 0;

  const solutions = new Map();

  const counts = createEmptyCounts();

  function backtrack(remainingTime, currentProfit) {
    const key = getCombinationKey(counts);

    if (currentProfit > maxProfit) {
      maxProfit = currentProfit;

      solutions.clear();

      solutions.set(key, { ...counts });
    } else if (currentProfit === maxProfit) {
      solutions.set(key, { ...counts });
    }

    for (const building of BUILDINGS) {
      if (remainingTime <= building.buildTime) {
        continue;
      }

      const nextTime = remainingTime - building.buildTime;

      const earnings = nextTime * building.earningsPerUnit;

      counts[building.type]++;

      backtrack(nextTime, currentProfit + earnings);

      counts[building.type]--;
    }
  }

  backtrack(timeUnits, 0);

  return {
    maxProfit,
    solutions: sortSolutions(solutions.values()),
  };
}

// ==========================================
// SHARED OPTIMAL SOLUTION RECONSTRUCTION
// ==========================================

function reconstructSolutions(timeUnits, getProfit) {
  const solutions = new Map();

  const visited = new Set();

  const stack = [
    {
      remainingTime: timeUnits,
      counts: createEmptyCounts(),
    },
  ];

  while (stack.length > 0) {
    const { remainingTime, counts } = stack.pop();

    const combinationKey = getCombinationKey(counts);

    const stateKey = `${remainingTime}:${combinationKey}`;

    // Avoid processing an identical state twice.
    if (visited.has(stateKey)) {
      continue;
    }

    visited.add(stateKey);

    const bestProfit = getProfit(remainingTime);

    // No further profitable construction.
    if (bestProfit === 0) {
      solutions.set(combinationKey, { ...counts });

      continue;
    }

    // Follow only optimal construction choices.
    for (const building of BUILDINGS) {
      if (remainingTime <= building.buildTime) {
        continue;
      }

      const nextTime = remainingTime - building.buildTime;

      const earnings = nextTime * building.earningsPerUnit;

      const candidateProfit = earnings + getProfit(nextTime);

      if (candidateProfit === bestProfit) {
        stack.push({
          remainingTime: nextTime,

          counts: {
            ...counts,

            [building.type]: counts[building.type] + 1,
          },
        });
      }
    }
  }

  return sortSolutions(solutions.values());
}

// ==========================================
// APPROACH 2: TOP-DOWN DP (MEMOIZATION)
// ==========================================

export function calculateMaxProfitMemoized(timeUnits) {
  validateTimeUnits(timeUnits, MAX_MEMOIZATION_TIME);

  const memo = new Map();

  function solve(remainingTime) {
    if (memo.has(remainingTime)) {
      return memo.get(remainingTime);
    }

    let bestProfit = 0;

    for (const building of BUILDINGS) {
      if (remainingTime <= building.buildTime) {
        continue;
      }

      const nextTime = remainingTime - building.buildTime;

      const earnings = nextTime * building.earningsPerUnit;

      const candidateProfit = earnings + solve(nextTime);

      bestProfit = Math.max(bestProfit, candidateProfit);
    }

    memo.set(remainingTime, bestProfit);

    return bestProfit;
  }

  const maxProfit = solve(timeUnits);

  return {
    maxProfit,

    solutions: reconstructSolutions(timeUnits, solve),
  };
}

// ==========================================
// APPROACH 3: BOTTOM-UP DP (TABULATION)
// ==========================================

export function calculateMaxProfitTabulated(timeUnits) {
  validateTimeUnits(timeUnits, MAX_DP_TIME);

  const dp = new Array(timeUnits + 1).fill(0);

  for (let time = 1; time <= timeUnits; time++) {
    for (const building of BUILDINGS) {
      if (time <= building.buildTime) {
        continue;
      }

      const nextTime = time - building.buildTime;

      const earnings = nextTime * building.earningsPerUnit;

      const candidateProfit = earnings + dp[nextTime];

      dp[time] = Math.max(dp[time], candidateProfit);
    }
  }

  return {
    maxProfit: dp[timeUnits],

    solutions: reconstructSolutions(timeUnits, (time) => dp[time]),
  };
}

// ==========================================
// DEFAULT PRODUCTION ALGORITHM
// ==========================================

export function calculateMaxProfit(timeUnits) {
  return calculateMaxProfitTabulated(timeUnits);
}
