import { Component, PropsWithChildren } from 'react';

export class ErrorBoundary extends Component<PropsWithChildren, unknown> {
	render() {
		return this.props.children;
	}
}
