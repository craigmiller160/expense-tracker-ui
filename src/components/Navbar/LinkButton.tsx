import { Button } from '@mui/material';
import { Link } from 'react-router-dom';
import './LinkButton.scss';
import { useLocation } from 'react-router';

interface Props {
	readonly to: string;
	readonly label: string;
}

export const LinkButton = (props: Props) => {
	const location = useLocation();
	const classes = ['LinkButton'].join(',');
	return (
		<Button
			className={classes}
			component={Link}
			to={props.to}
			color="inherit"
		>
			{props.label}
		</Button>
	);
};
