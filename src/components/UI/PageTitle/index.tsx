import { Typography } from '@mui/material';
import styled from '@emotion/styled';

interface Props {
	readonly title: string;
}

const TitleWrapper = styled.div`
	margin-bottom: 2rem;
`;

export const PageTitle = (props: Props) => (
	<TitleWrapper>
		<Typography variant="h4">{props.title}</Typography>
	</TitleWrapper>
);
