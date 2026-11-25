import test from 'node:test';

import assert from 'node:assert/strict';

import { spawnSync } from 'node:child_process';

import { fileURLToPath } from 'node:url';

import { BUILDINGS } from '../src/config/buildings.js';

import {
  calculateMaxProfitBruteForce,
  calculateMaxProfitMemoized,
  calculateMaxProfitTabulated,
  calculateMaxProfit,
} from '../src/algorithms/maxProfit.js';

import {
  parseTimeUnits,
  validateTimeUnits,
  MAX_BRUTE_FORCE_TIME,
  MAX_MEMOIZATION_TIME,
  MAX_DP_TIME,
} from '../src/utils/validation.js';

// ==========================================
// BUILDING CONFIGURATION
// ==========================================

test('Building configuration matches requirements', () => {
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
  assert.ok(Object.isFrozen(BUILDINGS));

  for (const building of BUILDINGS) {
    assert.ok(Object.isFrozen(building));
  }
});

// ==========================================
// SHARED TEST CASES
// ==========================================

const ALGORITHMS = [
  {
    name: 'Brute Force',
    calculate: calculateMaxProfitBruteForce,
    maxTime: MAX_BRUTE_FORCE_TIME,
  },
  {
    name: 'Memoization',
    calculate: calculateMaxProfitMemoized,
    maxTime: MAX_MEMOIZATION_TIME,
  },
  {
    name: 'Tabulation',
    calculate: calculateMaxProfitTabulated,
    maxTime: MAX_DP_TIME,
  },
];

const TEST_CASES = [
  {
    time: 0,
    maxProfit: 0,
    solutions: [{ T: 0, P: 0, C: 0 }],
  },
  {
    time: 1,
    maxProfit: 0,
    solutions: [{ T: 0, P: 0, C: 0 }],
  },
  {
    time: 2,
    maxProfit: 0,
    solutions: [{ T: 0, P: 0, C: 0 }],
  },
  {
    time: 3,
    maxProfit: 0,
    solutions: [{ T: 0, P: 0, C: 0 }],
  },
  {
    time: 4,
    maxProfit: 0,
    solutions: [{ T: 0, P: 0, C: 0 }],
  },
  {
    time: 5,
    maxProfit: 1000,
    solutions: [{ T: 0, P: 1, C: 0 }],
  },
  {
    time: 6,
    maxProfit: 2000,
    solutions: [{ T: 0, P: 1, C: 0 }],
  },
  {
    time: 7,
    maxProfit: 3000,
    solutions: [
      { T: 1, P: 0, C: 0 },
      { T: 0, P: 1, C: 0 },
    ],
  },
  {
    time: 8,
    maxProfit: 4500,
    solutions: [{ T: 1, P: 0, C: 0 }],
  },
  {
    time: 9,
    maxProfit: 6000,
    solutions: [
      { T: 1, P: 0, C: 0 },
      { T: 0, P: 2, C: 0 },
    ],
  },
  {
    time: 13,
    maxProfit: 16500,
    solutions: [{ T: 2, P: 0, C: 0 }],
  },
  {
    time: 21,
    maxProfit: 51500,
    solutions: [{ T: 3, P: 1, C: 0 }],
  },
];

// ==========================================
// RUN EVERY CASE AGAINST EVERY ALGORITHM
// ==========================================

for (const algorithm of ALGORITHMS) {
  for (const testCase of TEST_CASES) {
    test(`${algorithm.name}: time ${testCase.time}`, () => {
      assert.deepEqual(algorithm.calculate(testCase.time), {
        maxProfit: testCase.maxProfit,
        solutions: testCase.solutions,
      });
    });
  }

  test(`${algorithm.name}: rejects invalid inputs`, () => {
    for (const value of [
      -1,
      7.5,
      '13',
      NaN,
      Infinity,
      -Infinity,
      null,
      undefined,
      Number.MAX_SAFE_INTEGER + 1,
    ]) {
      assert.throws(
        () => algorithm.calculate(value),
        /non-negative safe integer/,
      );
    }
  });

  test(`${algorithm.name}: enforces input limit`, () => {
    assert.throws(
      () => algorithm.calculate(algorithm.maxTime + 1),
      /cannot exceed/,
    );
  });

  test(`${algorithm.name}: independent results`, () => {
    const result = algorithm.calculate(7);

    result.solutions[0].T = 99;

    assert.deepEqual(result.solutions[1], { T: 0, P: 1, C: 0 });

    assert.deepEqual(algorithm.calculate(7), {
      maxProfit: 3000,
      solutions: [
        { T: 1, P: 0, C: 0 },
        { T: 0, P: 1, C: 0 },
      ],
    });
  });
}

// ==========================================
// CROSS-ALGORITHM REGRESSION TESTS
// ==========================================

test('All algorithms agree for time units 0 to 50', () => {
  for (let time = 0; time <= MAX_BRUTE_FORCE_TIME; time++) {
    const brute = calculateMaxProfitBruteForce(time);

    const memo = calculateMaxProfitMemoized(time);

    const dp = calculateMaxProfitTabulated(time);

    assert.deepEqual(memo, brute, `Memoization mismatch at time ${time}`);

    assert.deepEqual(dp, brute, `Tabulation mismatch at time ${time}`);
  }
});

test('Optimized algorithms agree on larger inputs', () => {
  for (const time of [51, 100, 250, 500, 1000]) {
    assert.deepEqual(
      calculateMaxProfitMemoized(time),
      calculateMaxProfitTabulated(time),
    );
  }
});

test('Default algorithm uses optimized calculation', () => {
  for (const time of [0, 7, 13, 21, 100]) {
    assert.deepEqual(
      calculateMaxProfit(time),
      calculateMaxProfitTabulated(time),
    );
  }
});

test('Returned solutions contain no duplicates', () => {
  for (let time = 0; time <= 100; time++) {
    const result = calculateMaxProfit(time);

    const keys = result.solutions.map(({ T, P, C }) => `${T},${P},${C}`);

    assert.equal(new Set(keys).size, keys.length);
  }
});

test('Every returned combination fits the time budget', () => {
  for (let time = 0; time <= 100; time++) {
    const result = calculateMaxProfit(time);

    for (const solution of result.solutions) {
      const totalBuildTime = solution.T * 5 + solution.P * 4 + solution.C * 10;

      assert.ok(totalBuildTime <= time);

      for (const count of Object.values(solution)) {
        assert.ok(Number.isInteger(count) && count >= 0);
      }
    }
  }
});

test('Maximum earnings never decrease as time increases', () => {
  let previousProfit = 0;

  for (let time = 0; time <= 100; time++) {
    const { maxProfit } = calculateMaxProfit(time);

    assert.ok(maxProfit >= previousProfit);

    previousProfit = maxProfit;
  }
});

// ==========================================
// INDEPENDENT SOLUTION EARNINGS VERIFICATION
// ==========================================

test('Every returned combination achieves the reported earnings', () => {
  // For fixed building counts, ordering by
  // descending earnings/build-time ratio
  // maximizes total operational earnings.
  const orderedBuildings = [...BUILDINGS].sort(
    (a, b) => b.earningsPerUnit / b.buildTime - a.earningsPerUnit / a.buildTime,
  );

  for (let time = 0; time <= 100; time++) {
    const result = calculateMaxProfit(time);

    for (const solution of result.solutions) {
      let elapsedTime = 0;

      let totalEarnings = 0;

      for (const building of orderedBuildings) {
        const count = solution[building.type];

        for (let i = 0; i < count; i++) {
          elapsedTime += building.buildTime;

          totalEarnings += (time - elapsedTime) * building.earningsPerUnit;
        }
      }

      assert.equal(
        totalEarnings,
        result.maxProfit,
        `Incorrect earnings at time ${time}`,
      );
    }
  }
});

// ==========================================
// LARGE INPUT TESTS
// ==========================================

test('Tabulation handles the maximum supported input', () => {
  const result = calculateMaxProfitTabulated(MAX_DP_TIME);

  assert.ok(result.maxProfit > 0);

  assert.ok(Number.isSafeInteger(result.maxProfit));

  assert.ok(result.solutions.length > 0);

  for (const solution of result.solutions) {
    const totalBuildTime = solution.T * 5 + solution.P * 4 + solution.C * 10;

    assert.ok(totalBuildTime <= MAX_DP_TIME);
  }
});

// ==========================================
// INPUT PARSING TESTS
// ==========================================

const VALID_INPUTS = [
  ['13', 13],
  [' 7 ', 7],
  ['0', 0],
  ['007', 7],
  ['10000', 10000],
];

for (const [input, expected] of VALID_INPUTS) {
  test(`Parses valid input ${JSON.stringify(input)}`, () => {
    assert.equal(parseTimeUnits(input), expected);
  });
}

const INVALID_INPUTS = [
  '',
  '   ',
  '-5',
  '7.5',
  'abc',
  '1e2',
  '0x10',
  '+7',
  null,
  undefined,
  '9007199254740992',
];

for (const input of INVALID_INPUTS) {
  test(`Rejects invalid input ${JSON.stringify(input)}`, () => {
    assert.throws(() => parseTimeUnits(input), /non-negative/);
  });
}

test('Accepts maximum default time', () => {
  assert.equal(validateTimeUnits(MAX_DP_TIME), MAX_DP_TIME);
});

test('Rejects input exceeding default maximum', () => {
  assert.throws(() => parseTimeUnits('10001'), /cannot exceed/);
});

test('Supports custom algorithm limits', () => {
  assert.equal(parseTimeUnits('50', MAX_BRUTE_FORCE_TIME), 50);

  assert.throws(
    () => parseTimeUnits('51', MAX_BRUTE_FORCE_TIME),
    /cannot exceed/,
  );
});

// ==========================================
// CLI INTEGRATION TESTS
// ==========================================

const CLI_PATH = fileURLToPath(new URL('../src/main.js', import.meta.url));

function runCli(args, input = '') {
  return spawnSync(process.execPath, [CLI_PATH, ...args], {
    encoding: 'utf8',
    input,
    timeout: 10000,
  });
}

test('CLI uses bottom-up DP by default', () => {
  const result = runCli(['13']);

  assert.equal(result.status, 0);

  assert.match(result.stdout, /Earnings: \$16500/);

  assert.match(result.stdout, /T: 2 P: 0 C: 0/);

  assert.match(result.stdout, /Bottom-Up DP/);
});

test('CLI supports memoization', () => {
  const result = runCli(['7', 'memo']);

  assert.equal(result.status, 0);

  assert.match(result.stdout, /Earnings: \$3000/);

  assert.match(result.stdout, /T: 1 P: 0 C: 0/);

  assert.match(result.stdout, /T: 0 P: 1 C: 0/);

  assert.match(result.stdout, /Top-Down DP/);
});

test('CLI supports brute force', () => {
  const result = runCli(['21', 'brute']);

  assert.equal(result.status, 0);

  assert.match(result.stdout, /Earnings: \$51500/);

  assert.match(result.stdout, /T: 3 P: 1 C: 0/);
});

test('CLI supports interactive input', () => {
  const result = runCli([], '8\n');

  assert.equal(result.status, 0);

  assert.match(result.stdout, /Earnings: \$4500/);
});

test('CLI rejects invalid algorithm', () => {
  const result = runCli(['13', 'invalid']);

  assert.equal(result.status, 1);

  assert.match(result.stderr, /Invalid algorithm/);
});

test('CLI rejects invalid time input', () => {
  const result = runCli(['-5']);

  assert.equal(result.status, 1);

  assert.match(result.stderr, /non-negative/);
});

test('CLI rejects excessive brute-force input', () => {
  const result = runCli(['51', 'brute']);

  assert.equal(result.status, 1);

  assert.match(result.stderr, /cannot exceed/);
});

test('CLI rejects extra arguments', () => {
  const result = runCli(['13', 'dp', 'extra']);

  assert.equal(result.status, 1);

  assert.match(result.stderr, /Too many arguments/);
});

test('CLI displays help', () => {
  const result = runCli(['--help']);

  assert.equal(result.status, 0);

  assert.match(result.stdout, /Usage:/);

  assert.match(result.stdout, /memo/);

  assert.match(result.stdout, /brute/);
});
