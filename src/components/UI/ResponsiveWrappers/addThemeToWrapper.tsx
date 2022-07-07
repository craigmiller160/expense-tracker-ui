import { PropsWithChildren } from 'react';
import { InnerDivProps, WrapperOuterProps } from './utils';
import { StyledComponent } from '@emotion/styled';
import { useTheme } from '@mui/material';

export const addThemeToWrapper =
	(Wrapper: StyledComponent<PropsWithChildren<InnerDivProps>>) =>
	// eslint-disable-next-line react/display-name
	(props: PropsWithChildren<WrapperOuterProps>) => {
		const theme = useTheme();
		return (
			<Wrapper
				theme={theme}
				className={props.className}
				data-testid={props['data-testid']}
			>
				{props.children}
			</Wrapper>
		);
	};
