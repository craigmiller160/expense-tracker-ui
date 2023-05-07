import { useForm, UseFormProps, UseFormReturn } from 'react-hook-form';
import {
	SyncFromParams,
	SyncToParams,
	useSearchParamSync
} from './useSearchParamSync';
import { useEffect, useState } from 'react';
import { mergeWith } from 'lodash-es';

type Props<T extends object> = UseFormProps<T> & {
	readonly formFromParams: SyncFromParams<T>;
	readonly formToParams: SyncToParams<T>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	readonly formFromParamsDependencies?: ReadonlyArray<any>;
};

export const useFormWithSearchParamSync = <T extends object>(
	props: Props<T>
): UseFormReturn<T> => {
	const [hasRendered, setHasRendered] = useState<boolean>(false);
	const [params, setParams] = useSearchParamSync({
		syncFromParams: props.formFromParams,
		syncToParams: props.formToParams,
		syncFromParamsDependencies: props.formFromParamsDependencies
	});
	const form = useForm<T>(props);
	const { reset, watch } = form;

	useEffect(() => {
		if (!hasRendered) {
			const merged = mergeWith(
				{},
				props.defaultValues ?? {},
				params,
				(a, b) => b ?? a
			);
			setParams(merged);
		} else {
			reset(params);
		}
		setHasRendered(true);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reset, params, hasRendered]);

	useEffect(() => {
		const subscription = watch((value) => setParams(value as T));
		return subscription.unsubscribe;
	}, [watch, setParams]);

	return form;
};
