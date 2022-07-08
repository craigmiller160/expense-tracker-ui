import { useMediaQuery, useTheme } from '@mui/material';

export const useCanFitNavbarItems = (): boolean => {
	const theme = useTheme();
	return useMediaQuery(theme.breakpoints.up('md'));
};
