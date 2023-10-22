import styled from '@emotion/styled';
import type { InnerDivProps } from './utils';
import { addThemeToWrapper } from './addThemeToWrapper';

export type OverrideChildWidth = {
	xs?: string;
	sm?: string;
};

type ResponsiveRowProps = {
	readonly overrideChildWidth?: OverrideChildWidth;
};

const InnerDiv = styled.div<ResponsiveRowProps & InnerDivProps>`
	width: 100%;
	display: flex;

	${({ theme }) => theme.breakpoints.up('xs')} {
		flex-direction: column;
		> * {
			width: ${({ overrideChildWidth }) =>
				overrideChildWidth?.xs ?? '100%'};
			margin: 0.5rem auto !important;
		}
	}

	${({ theme }) => theme.breakpoints.up('sm')} {
		flex-direction: row;
		justify-content: space-between;
		margin: 0.5rem auto;
		> * {
			width: ${({ overrideChildWidth }) =>
				overrideChildWidth?.sm ?? '30%'};
		}
	}
`;

export const ResponsiveRow = addThemeToWrapper<ResponsiveRowProps>(InnerDiv);
