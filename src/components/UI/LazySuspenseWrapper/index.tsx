import { ComponentType, LazyExoticComponent, Suspense } from 'react';
import { Fallback } from './Fallback';

interface Props {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	readonly component: LazyExoticComponent<ComponentType<any>>;
}

export const LazySuspenseWrapper = (props: Props) => {
	const Component = props.component;
	return (
		<Suspense fallback={<Fallback />}>
			<Component />
		</Suspense>
	);
};
