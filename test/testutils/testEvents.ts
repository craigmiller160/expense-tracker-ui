import { fireEvent } from '@testing-library/react';

export const typeInInput = (element: HTMLInputElement, value: string) =>
	fireEvent.change(element, {
		target: {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			value
		}
	});
