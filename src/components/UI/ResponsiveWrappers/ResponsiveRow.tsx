import styled from '@emotion/styled';
import { InnerDivProps } from './utils';
import { addThemeToWrapper } from './addThemeToWrapper';

type ResponsiveRowProps = {
	readonly overrideChildWidth?: {
		xs?: string;
		sm?: string;
		xl?: string;
	};
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
		justify-content: space-around;
		margin: 0.5rem auto;
		> * {
			width: ${({ overrideChildWidth }) =>
				overrideChildWidth?.sm ?? '30%'};
		}
	}

	${({ theme }) => theme.breakpoints.up('xl')} {
		> * {
			width: ${({ overrideChildWidth }) =>
				overrideChildWidth?.xl ?? '20%'};
		}
	}
`;

export const ResponsiveRow = addThemeToWrapper<ResponsiveRowProps>(InnerDiv);
