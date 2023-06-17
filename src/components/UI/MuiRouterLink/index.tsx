import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@mui/material';
import { PropsWithChildren } from 'react';
import { TypographyProps } from '@mui/material/Typography';

type Props = {
	readonly variant: TypographyProps['variant'];
	readonly to: string;
};

export const MuiRouterLink = (props: PropsWithChildren<Props>) => (
	<Link
		component={RouterLink}
		variant="body1"
		underline="none"
		color="secondary"
		to={props.to}
	>
		{props.children}
	</Link>
);
