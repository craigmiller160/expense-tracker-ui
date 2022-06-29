import { PropsWithChildren, useContext } from 'react';
import { AlertContext } from './UI/Alerts/AlertProvider';
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query';

export const AppQueryClientProvider = (props: PropsWithChildren) => {
	const alertContext = useContext(AlertContext);
	const queryClient = new QueryClient({
		queryCache: new QueryCache({
			onError: (error) => {
				console.log('OnError');
				alertContext.addAlert('error', 'Have an error');
			}
		})
	});
	return (
		<QueryClientProvider client={queryClient}>
			{props.children}
		</QueryClientProvider>
	);
};
