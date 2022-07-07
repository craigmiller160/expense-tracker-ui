import styled from '@emotion/styled';
import { InnerDivProps } from '../../../UI/ResponsiveWrappers/utils';
import { addThemeToWrapper } from '../../../UI/ResponsiveWrappers/addThemeToWrapper';

const InnerDiv = styled.div<InnerDivProps>`
	> * {
		margin: 0 0.2rem;
		&:not(.visible) {
			visibility: hidden;
		}
	}
`;

export const ResponsiveFlagsContainer = addThemeToWrapper(InnerDiv);
