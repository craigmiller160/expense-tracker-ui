import { Breakpoint, useMediaQuery, useTheme } from '@mui/material';

export const useIsAtLeastBreakpoint = (breakpoint: Breakpoint): boolean => {
	const theme = useTheme();
	return useMediaQuery(theme.breakpoints.up(breakpoint));
};
