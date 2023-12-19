import { DEPLOYED_LEND_CONTRACTS } from '$lib/constants';
import type { ParamMatcher } from '@sveltejs/kit';

export const match: ParamMatcher = (param) => {
	return DEPLOYED_LEND_CONTRACTS.includes(param);
};
