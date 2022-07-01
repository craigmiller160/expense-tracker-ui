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
	const isActive = location.pathname.startsWith(props.to);
	const classes = ['LinkButton', isActive ? 'active' : null]
		.filter((c) => c !== null)
		.join(' ');
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
