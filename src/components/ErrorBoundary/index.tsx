import { Component, PropsWithChildren, ErrorInfo } from 'react';

export class ErrorBoundary extends Component<PropsWithChildren, unknown> {
	componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		console.log('CATCHING', error, errorInfo);
	}

	render() {
		return this.props.children;
	}
}
