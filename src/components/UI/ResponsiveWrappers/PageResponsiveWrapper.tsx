import styled from '@emotion/styled';
import { useTheme } from '@mui/material';
import { PropsWithChildren } from 'react';
import { InnerDivProps, WrapperOuterProps } from './utils';

const InnerDiv = styled.div<InnerDivProps>`
	display: flex;
	flex-direction: column;
	align-items: center;
	margin: 0 auto;
	padding: 2rem;

	${({ theme }) => theme.breakpoints.up('xl')} {
		width: 60%;
	}

	${({ theme }) => theme.breakpoints.up('lg')} {
		width: 70%;
	}

	${({ theme }) => theme.breakpoints.down('lg')} {
		width: 100%;
	}
`;

export const PageResponsiveWrapper = (
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
