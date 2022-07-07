import styled from '@emotion/styled';
import { InnerDivProps } from './utils';
import { addThemeToWrapper } from './addThemeToWrapper';

// TODO delete if unused

const InnerDiv = styled.div<InnerDivProps>`
	& > .SlideDialog {
		width: 100%;
	}
`;

export const SlideDialogResponsiveWrapper = addThemeToWrapper(InnerDiv);
