// TODO delete this file
import { useLocation } from 'react-router';

export const Simple = () => {
	const location = useLocation();
	return (
		<div>
			<p>Hello World</p>
			<p>Path: {location.pathname}</p>
		</div>
	);
};
