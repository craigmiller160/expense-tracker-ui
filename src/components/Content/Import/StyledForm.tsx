import { Breakpoints } from '@mui/material';
import styled from '@emotion/styled';

interface StyledFormProps {
	readonly breakpoints: Breakpoints;
}

export const StyledForm = styled.form<StyledFormProps>`
	width: 100%;
	> * {
		margin: 1rem auto;
		width: 100%;
	}

	${({ breakpoints }) => breakpoints.up('md')} {
		width: 50%;
	}

	${({ breakpoints }) => breakpoints.up('lg')} {
		width: 40%;
	}

	${({ breakpoints }) => breakpoints.up('xl')} {
		width: 30%;
	}
`;
