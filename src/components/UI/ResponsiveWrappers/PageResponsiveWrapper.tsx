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
	${({ theme }) => theme.breakpoints.up('xl')} {
		width: 60%;
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
