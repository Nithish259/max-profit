export const MAX_BRUTE_FORCE_TIME = 50;

export function validateTimeUnits(timeUnits) {
  if (!Number.isSafeInteger(timeUnits) || timeUnits < 0) {
    throw new Error('Time units must be a non-negative safe integer.');
  }

  if (timeUnits > MAX_BRUTE_FORCE_TIME) {
    throw new Error(
      `Time units cannot exceed ${MAX_BRUTE_FORCE_TIME} ` +
        'when using the brute-force algorithm.',
    );
  }

  return timeUnits;
}

export function parseTimeUnits(input) {
  if (typeof input !== 'string' || !/^\d+$/.test(input.trim())) {
    throw new Error('Please enter a non-negative integer.');
  }

  return validateTimeUnits(Number(input.trim()));
}
