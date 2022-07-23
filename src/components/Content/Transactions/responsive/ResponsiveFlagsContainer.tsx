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
`;

export const ResponsiveFlagsContainer = addThemeToWrapper(InnerDiv);
