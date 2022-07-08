import { Breakpoint, useMediaQuery, useTheme } from '@mui/material';

export const useIsExactlyBreakpoint = (breakpoint: Breakpoint): boolean => {
	const theme = useTheme();
	return useMediaQuery(theme.breakpoints.only(breakpoint));
};
