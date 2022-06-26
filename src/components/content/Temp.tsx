import { authUserResource } from '../../services/AuthService';

export const Temp = () => {
	const [data] = authUserResource;
	return (
		<div>
			<h1>Temp</h1>
			<p>Loading: {data.loading ? 'true' : 'false'}</p>
			<p>Error: {data.error && (data.error as Error).message}</p>
			{!data.loading && !data.error && (
				<p>Data: {JSON.stringify(data())}</p>
			)}
		</div>
	);
};
