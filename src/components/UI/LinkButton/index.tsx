import Button from '@suid/material/Button';
import { useNavigate } from 'solid-app-router';
import { EventHandler } from '../../../types/solid';

type OnClickHandler = EventHandler<HTMLButtonElement, MouseEvent>;

interface Props {
	readonly path: string;
	readonly label: string;
	readonly color?:
		| 'inherit'
		| 'primary'
		| 'secondary'
		| 'success'
		| 'error'
		| 'info'
		| 'warning';
	readonly onClick?: OnClickHandler;
}

export const LinkButton = (props: Props) => {
	const navigate = useNavigate();
	const onClick: OnClickHandler = (event) => {
		navigate(props.path);
		props.onClick?.(event);
	};
	return (
		<Button onClick={onClick} color={props.color}>
			{props.label}
		</Button>
	);
};
