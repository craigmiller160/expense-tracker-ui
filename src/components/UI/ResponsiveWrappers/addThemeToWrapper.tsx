import type { PropsWithChildren } from 'react';
import type { InnerDivProps, WrapperOuterProps } from './utils';
import type { StyledComponent } from '@emotion/styled';
import { useTheme } from '@mui/material';

// Define the generic parameter when using this function to avoid theme prop leaking to outer scope
export const addThemeToWrapper =
	<T extends object>(
		Wrapper: StyledComponent<PropsWithChildren<InnerDivProps & T>>
	) =>
	// eslint-disable-next-line react/display-name
	(props: PropsWithChildren<WrapperOuterProps & T>) => {
		const theme = useTheme();
		return (
			<Wrapper {...props} theme={theme}>
				{props.children}
			</Wrapper>
		);
	};
