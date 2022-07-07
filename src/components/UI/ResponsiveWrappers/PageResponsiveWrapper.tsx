import styled from '@emotion/styled';
import { InnerDivProps } from './utils';
import { addThemeToWrapper } from './addThemeToWrapper';

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

export const PageResponsiveWrapper = addThemeToWrapper(InnerDiv);
