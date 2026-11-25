export const MAX_BRUTE_FORCE_TIME = 50;

export const MAX_MEMOIZATION_TIME = 1000;

export const MAX_DP_TIME = 10000;

export function validateTimeUnits(timeUnits, maxTime = MAX_DP_TIME) {
  if (!Number.isSafeInteger(timeUnits) || timeUnits < 0) {
    throw new Error('Time units must be a non-negative safe integer.');
  }

  if (timeUnits > maxTime) {
    throw new Error(`Time units cannot exceed ${maxTime}.`);
  }

  return timeUnits;
}

export function parseTimeUnits(input, maxTime = MAX_DP_TIME) {
  if (typeof input !== 'string' || !/^\d+$/.test(input.trim())) {
    throw new Error('Please enter a non-negative integer.');
  }

  return validateTimeUnits(Number(input.trim()), maxTime);
}
