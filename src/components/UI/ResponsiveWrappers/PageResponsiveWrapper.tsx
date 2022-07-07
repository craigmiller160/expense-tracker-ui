import styled from '@emotion/styled';
import { Theme, useTheme } from '@mui/material';
import { PropsWithChildren } from 'react';

// TODO add PageRoot styles here

interface Props {
	readonly className?: string;
	readonly 'data-testid'?: string;
}

interface InnerDivProps {
	readonly theme: Theme;
}

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

export const PageResponsiveWrapper = (props: PropsWithChildren<Props>) => {
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
