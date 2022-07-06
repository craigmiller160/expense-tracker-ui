import { useCallback, useState } from 'react';

export type ForceUpdate = () => void;
export const useForceUpdate = (): ForceUpdate => {
	const [, setState] = useState<number>(0);
	return useCallback(() => setState((prev) => prev + 1), [setState]);
};
