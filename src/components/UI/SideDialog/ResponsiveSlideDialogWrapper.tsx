import styled from '@emotion/styled';
import { InnerDivProps, WrapperOuterProps } from '../ResponsiveWrappers/utils';
import { PropsWithChildren } from 'react';
import { Paper, useTheme } from '@mui/material';

const InnerDiv = styled.div<InnerDivProps>`
	min-height: 100%;

	> .MuiPaper-root {
		min-height: 100%;
	}

	${({ theme }) => theme.breakpoints.up('xl')} {
		width: 30% !important;
	}

	${({ theme }) => theme.breakpoints.up('lg')} {
		width: 35% !important;
	}

	${({ theme }) => theme.breakpoints.up('md')} {
		width: 40% !important;
	}
`;

export const ResponsiveSlideDialogWrapper = (
	props: PropsWithChildren<WrapperOuterProps>
) => {
	const theme = useTheme();
	return (
		<InnerDiv
			id="SlideDialogWrapper"
			theme={theme}
			className={props.className}
			data-testid={props['data-testid']}
		>
			<Paper>{props.children}</Paper>
		</InnerDiv>
	);
};
