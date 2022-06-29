import { PropsWithChildren } from 'react';
import { QueryErrorSupportProvider } from './QueryErrorSupportProvider';
import { AppQueryClientProvider } from './AppQueryClientProvider';
import { QueryErrorSupportHandler } from './QueryErrorSupportHandler';

export const AppQueryAndErrorHandlingProvider = (props: PropsWithChildren) => (
	<QueryErrorSupportProvider>
		<AppQueryClientProvider>
			<QueryErrorSupportHandler>
				{props.children}
			</QueryErrorSupportHandler>
		</AppQueryClientProvider>
	</QueryErrorSupportProvider>
);
