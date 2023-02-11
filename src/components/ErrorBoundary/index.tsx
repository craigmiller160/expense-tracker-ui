import { Component, PropsWithChildren, ErrorInfo } from 'react';

// TODO delete this

type State = {
	readonly error: Error;
};

export class ErrorBoundary extends Component<PropsWithChildren, State> {
	static getDerivedStateFromError(error: any): Partial<State> {
		return {
			error
		};
	}
	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.log('CATCHING', error, errorInfo);
	}

	render() {
		console.log('RENDERING');
		return this.props.children;
	}
}
