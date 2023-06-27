import { useIsAtLeastBreakpoint } from '../../../utils/breakpointHooks';

export const useIsEditMode = () => {
	const isAtLeastSm = useIsAtLeastBreakpoint('sm');
	return process.env.NODE_ENV === 'test' || isAtLeastSm;
};
