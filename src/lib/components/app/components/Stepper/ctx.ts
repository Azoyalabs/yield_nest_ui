import { getContext, setContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';

const KEY = 'stepper';

export type Context = Writable<{
	progress: number;
    locked: boolean;
    steps: number;
}>;

export function setCtx<T extends Context>(content: T = writable({ progress: 0, locked: false, steps: 0 }) as T) {
	setContext(KEY, content);
}

export function getCtx<T extends Context>() {
	return getContext<T>(KEY);
}
