import test from 'node:test';
import assert from 'node:assert/strict';

import { BUILDINGS } from '../src/config/buildings.js';

import { calculateMaxProfitBruteForce } from '../src/algorithms/maxProfit.js';

import {
  parseTimeUnits,
  validateTimeUnits,
  MAX_BRUTE_FORCE_TIME,
} from '../src/utils/validation.js';

// ==========================================
// BUILDING CONFIGURATION TESTS
// ==========================================

test('Building configuration matches assignment requirements', () => {
  assert.deepEqual(
    BUILDINGS.map((building) => ({
      type: building.type,
      buildTime: building.buildTime,
      earningsPerUnit: building.earningsPerUnit,
    })),
    [
      {
        type: 'T',
        buildTime: 5,
        earningsPerUnit: 1500,
      },
      {
        type: 'P',
        buildTime: 4,
        earningsPerUnit: 1000,
      },
      {
        type: 'C',
        buildTime: 10,
        earningsPerUnit: 2000,
      },
    ],
  );
});

test('Building configuration is immutable', () => {
  assert.equal(Object.isFrozen(BUILDINGS), true);

  for (const building of BUILDINGS) {
    assert.equal(Object.isFrozen(building), true);
  }
});

// ==========================================
// OFFICIAL ASSIGNMENT TEST CASES
// ==========================================

test('Official case 1: time unit 7', () => {
  assert.deepEqual(calculateMaxProfitBruteForce(7), {
    maxProfit: 3000,
    solutions: [
      { T: 1, P: 0, C: 0 },
      { T: 0, P: 1, C: 0 },
    ],
  });
});

test('Official case 2: time unit 8', () => {
  assert.deepEqual(calculateMaxProfitBruteForce(8), {
    maxProfit: 4500,
    solutions: [{ T: 1, P: 0, C: 0 }],
  });
});

test('Official case 3: time unit 13', () => {
  assert.deepEqual(calculateMaxProfitBruteForce(13), {
    maxProfit: 16500,
    solutions: [{ T: 2, P: 0, C: 0 }],
  });
});

// ==========================================
// EDGE CASES
// ==========================================

test('Zero available time', () => {
  assert.deepEqual(calculateMaxProfitBruteForce(0), {
    maxProfit: 0,
    solutions: [{ T: 0, P: 0, C: 0 }],
  });
});

test('Insufficient time for profitable construction', () => {
  for (let time = 1; time <= 4; time++) {
    assert.deepEqual(calculateMaxProfitBruteForce(time), {
      maxProfit: 0,
      solutions: [{ T: 0, P: 0, C: 0 }],
    });
  }
});

test('One pub is optimal for five time units', () => {
  assert.deepEqual(calculateMaxProfitBruteForce(5), {
    maxProfit: 1000,
    solutions: [{ T: 0, P: 1, C: 0 }],
  });
});

test('One pub is optimal for six time units', () => {
  assert.deepEqual(calculateMaxProfitBruteForce(6), {
    maxProfit: 2000,
    solutions: [{ T: 0, P: 1, C: 0 }],
  });
});

test('Three theatres and one pub are optimal for 21 time units', () => {
  assert.deepEqual(calculateMaxProfitBruteForce(21), {
    maxProfit: 51500,
    solutions: [{ T: 3, P: 1, C: 0 }],
  });
});

// ==========================================
// SOLUTION INTEGRITY TESTS
// ==========================================

test('Returned solutions contain no duplicates', () => {
  for (let time = 0; time <= 30; time++) {
    const result = calculateMaxProfitBruteForce(time);

    const keys = result.solutions.map(({ T, P, C }) => `${T},${P},${C}`);

    assert.equal(new Set(keys).size, keys.length);
  }
});

test('Every solution fits the time budget', () => {
  for (let time = 0; time <= 30; time++) {
    const result = calculateMaxProfitBruteForce(time);

    for (const solution of result.solutions) {
      const totalBuildTime = solution.T * 5 + solution.P * 4 + solution.C * 10;

      assert.ok(totalBuildTime <= time);
    }
  }
});

test('Saved solution objects remain independent', () => {
  const result = calculateMaxProfitBruteForce(7);

  result.solutions[0].T = 99;

  assert.deepEqual(result.solutions[1], { T: 0, P: 1, C: 0 });

  assert.deepEqual(calculateMaxProfitBruteForce(7), {
    maxProfit: 3000,
    solutions: [
      { T: 1, P: 0, C: 0 },
      { T: 0, P: 1, C: 0 },
    ],
  });
});

// ==========================================
// ALGORITHM INPUT VALIDATION
// ==========================================

test('Rejects negative time units', () => {
  assert.throws(() => calculateMaxProfitBruteForce(-1), /non-negative/);
});

test('Rejects fractional time units', () => {
  assert.throws(() => calculateMaxProfitBruteForce(7.5), /non-negative/);
});

test('Rejects string input', () => {
  assert.throws(() => calculateMaxProfitBruteForce('13'), /non-negative/);
});

test('Rejects non-finite numbers', () => {
  for (const value of [NaN, Infinity, -Infinity]) {
    assert.throws(() => calculateMaxProfitBruteForce(value), /non-negative/);
  }
});

test('Rejects unsafe integers', () => {
  assert.throws(
    () => calculateMaxProfitBruteForce(Number.MAX_SAFE_INTEGER + 1),
    /safe integer/,
  );
});

// ==========================================
// CLI INPUT VALIDATION
// ==========================================

test('Parses valid integer input', () => {
  assert.equal(parseTimeUnits('13'), 13);
});

test('Accepts whitespace around input', () => {
  assert.equal(parseTimeUnits('  7  '), 7);
});

test('Accepts zero', () => {
  assert.equal(parseTimeUnits('0'), 0);
});

test('Accepts leading zeros', () => {
  assert.equal(parseTimeUnits('007'), 7);
});

test('Rejects empty input', () => {
  assert.throws(() => parseTimeUnits(''), /non-negative/);
});

test('Rejects whitespace-only input', () => {
  assert.throws(() => parseTimeUnits('   '), /non-negative/);
});

test('Rejects negative string input', () => {
  assert.throws(() => parseTimeUnits('-5'), /non-negative/);
});

test('Rejects decimal string input', () => {
  assert.throws(() => parseTimeUnits('7.5'), /non-negative/);
});

test('Rejects alphabetic input', () => {
  assert.throws(() => parseTimeUnits('abc'), /non-negative/);
});

test('Rejects scientific notation', () => {
  assert.throws(() => parseTimeUnits('1e2'), /non-negative/);
});

test('Rejects hexadecimal notation', () => {
  assert.throws(() => parseTimeUnits('0x10'), /non-negative/);
});

test('Rejects null input', () => {
  assert.throws(() => parseTimeUnits(null), /non-negative/);
});

test('Accepts the maximum supported time', () => {
  assert.equal(validateTimeUnits(MAX_BRUTE_FORCE_TIME), MAX_BRUTE_FORCE_TIME);
});

test('Rejects time exceeding the brute-force limit', () => {
  assert.throws(
    () => calculateMaxProfitBruteForce(MAX_BRUTE_FORCE_TIME + 1),
    /cannot exceed/,
  );
});

test('Rejects CLI input exceeding the limit', () => {
  assert.throws(
    () => parseTimeUnits(String(MAX_BRUTE_FORCE_TIME + 1)),
    /cannot exceed/,
  );
});
