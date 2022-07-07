import styled from '@emotion/styled';
import { useTheme } from '@mui/material';
import { PropsWithChildren } from 'react';
import { InnerDivProps, WrapperOuterProps } from './utils';

// TODO delete if unused

const InnerDiv = styled.div<InnerDivProps>`
	& > .SlideDialog {
		width: 100%;
	}
`;

export const SlideDialogResponsiveWrapper = (
	props: PropsWithChildren<WrapperOuterProps>
) => {
	const theme = useTheme();
	return (
		<InnerDiv
			theme={theme}
			className={props.className}
			data-testid={props['data-testid']}
		>
			{props.children}
		</InnerDiv>
	);
};
