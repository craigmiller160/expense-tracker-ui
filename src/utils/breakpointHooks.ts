import { Breakpoint, useMediaQuery, useTheme } from '@mui/material';

export const useIsAtLeastBreakpoint = (breakpoint: Breakpoint): boolean => {
	const theme = useTheme();
	return useMediaQuery(theme.breakpoints.up(breakpoint));
};

export const useIsExactlyBreakpoint = (breakpoint: Breakpoint): boolean => {
	const theme = useTheme();
	return useMediaQuery(theme.breakpoints.only(breakpoint));
};

export const useIsAtMaxBreakpoint = (breakpoint: Breakpoint): boolean => {
	const theme = useTheme();
	return useMediaQuery(theme.breakpoints.down(breakpoint));
};
