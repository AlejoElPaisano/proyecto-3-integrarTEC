const UINT32_RANGE = 2 ** 32;

/** Returns a uniform cryptographically secure integer in [0, maxExclusive). */
export function secureRandomInt(maxExclusive: number): number {
	if (
		!Number.isSafeInteger(maxExclusive) ||
		maxExclusive <= 0 ||
		maxExclusive > UINT32_RANGE
	) {
		throw new RangeError("maxExclusive must be an integer between 1 and 2^32");
	}

	const randomValue = new Uint32Array(1);
	const rejectionLimit = UINT32_RANGE - (UINT32_RANGE % maxExclusive);

	do {
		crypto.getRandomValues(randomValue);
	} while (randomValue[0] >= rejectionLimit);

	return randomValue[0] % maxExclusive;
}
