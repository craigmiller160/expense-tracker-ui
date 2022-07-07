import styled from '@emotion/styled';
import { InnerDivProps } from '../../../UI/ResponsiveWrappers/utils';
import { addThemeToWrapper } from '../../../UI/ResponsiveWrappers/addThemeToWrapper';

const InnerDiv = styled.div<InnerDivProps>`
	display: flex;

	${({ theme }) => theme.breakpoints.up('xs')} {
		flex-direction: column;
		align-items: center;
	}

	${({ theme }) => theme.breakpoints.up('md')} {
		flex-direction: row;
		justify-content: center;
	}

	> * {
		margin: 0 0.2rem;
		&:not(.visible) {
			visibility: hidden;
		}
	}
`;

export const ResponsiveFlagsContainer = addThemeToWrapper(InnerDiv);
