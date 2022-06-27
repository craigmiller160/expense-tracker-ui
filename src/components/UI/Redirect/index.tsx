import { useNavigate } from 'solid-app-router';
import { createEffect } from 'solid-js';

interface Props {
	readonly path: string;
}

export const Redirect = (props: Props) => {
	const navigate = useNavigate();
	createEffect(() => navigate(props.path));
	return <></>;
};
