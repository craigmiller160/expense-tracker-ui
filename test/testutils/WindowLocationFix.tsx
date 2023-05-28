import { useSearchParams } from 'react-router-dom';
import { PropsWithChildren, useEffect } from 'react';

export const WindowLocationFix = (props: PropsWithChildren) => {
	const [searchParams] = useSearchParams();
	useEffect(() => {
		console.log('SEARCH', searchParams.toString());
		Object.defineProperty(window, 'location', {
			value: {
				search: `?${searchParams.toString()}`
			}
		});
		return () => {
			Object.defineProperty(window, 'location', {
				value: {
					search: ''
				}
			});
		};
	}, [searchParams]);
	return <>{props.children}</>;
};
