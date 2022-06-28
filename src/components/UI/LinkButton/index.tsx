import Button, { ButtonTypeMap } from '@suid/material/Button';
import { useNavigate } from 'solid-app-router';
import { DefaultComponentProps } from '@suid/types';

interface Props {
	readonly path: string;
	readonly onClick?: JSX.EventHandlerUnion<>
}

export const LinkButton: = (
	props: Props
) => {
	const navigate = useNavigate();
	const onClick = (event) => {
		navigate(props.path);
	};
	return <Button onClick={(evt) => {} />;
};
