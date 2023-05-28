import { createContext } from 'react';

export type NativeSearchProvider = () => string;

export const NativeSearchProviderContext = createContext<
	NativeSearchProvider | undefined
>(undefined);
