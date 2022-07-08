import styled from '@emotion/styled';
import { InnerDivProps, WrapperOuterProps } from '../ResponsiveWrappers/utils';
import { PropsWithChildren } from 'react';
import { Paper, useTheme } from '@mui/material';

const InnerDiv = styled.div<InnerDivProps>`
	width: 30%;
	min-height: 100%;

	> .MuiPaper-root {
		min-height: 100%;
	}
`;

export const ResponsiveSlideDialogWrapper = (
	props: PropsWithChildren<WrapperOuterProps>
) => {
	const theme = useTheme();
	return (
		<InnerDiv
			id="Hello"
			theme={theme}
			className={props.className}
			data-testid={props['data-testid']}
		>
			<Paper>{props.children}</Paper>
		</InnerDiv>
	);
};
