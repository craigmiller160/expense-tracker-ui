import styled from '@emotion/styled';
import { InnerDivProps } from '../../../UI/ResponsiveWrappers/utils';
import { addThemeToWrapper } from '../../../UI/ResponsiveWrappers/addThemeToWrapper';

const InnerDiv = styled.div<InnerDivProps>`
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	margin: 0.5rem auto;

	> * {
		width: 20%;
	}
`;

export const ResponsiveFilterRow = addThemeToWrapper(InnerDiv);
