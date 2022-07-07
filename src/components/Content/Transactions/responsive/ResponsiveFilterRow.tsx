import styled from '@emotion/styled';
import { InnerDivProps } from '../../../UI/ResponsiveWrappers/utils';
import { addThemeToWrapper } from '../../../UI/ResponsiveWrappers/addThemeToWrapper';

const InnerDiv = styled.div<InnerDivProps>`
	width: 100%;
	display: flex;

	${({ theme }) => theme.breakpoints.up('xs')} {
		flex-direction: column;
		> * {
			width: 100%;
			margin: 0.5rem auto !important;
		}
	}

	${({ theme }) => theme.breakpoints.up('sm')} {
		flex-direction: row;
		justify-content: space-around;
		margin: 0.5rem auto;
		> * {
			width: 30%;
		}
	}

	${({ theme }) => theme.breakpoints.up('xl')} {
		> * {
			width: 20%;
		}
	}
`;

export const ResponsiveFilterRow = addThemeToWrapper(InnerDiv);
