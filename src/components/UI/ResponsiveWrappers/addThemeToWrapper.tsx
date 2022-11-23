import { PropsWithChildren } from 'react';
import { InnerDivProps, WrapperOuterProps } from './utils';
import { StyledComponent } from '@emotion/styled';
import { useTheme } from '@mui/material';

// TODO need to exclude theme from the outer props
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
