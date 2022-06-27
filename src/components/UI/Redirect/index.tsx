import { useNavigate } from 'solid-app-router';
import { onMount } from 'solid-js';

interface Props {
	readonly path: string;
}

export const Redirect = (props: Props) => {
	const navigate = useNavigate();
	onMount(() => navigate(props.path));
	return <></>;
};
