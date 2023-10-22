import type { UseFormProps, UseFormReturn } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import type { SyncFromParams, SyncToParams } from './useSearchParamSync';
import { useSearchParamSync } from './useSearchParamSync';
import { useEffect, useState } from 'react';
import mergeWith from 'lodash.mergewith';

type Props<Form extends object> = UseFormProps<Form> & {
	readonly formFromParams: SyncFromParams<Form>;
	readonly formToParams: SyncToParams<Form>;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	readonly formFromParamsDependencies?: ReadonlyArray<any>;
};

export const useFormWithSearchParamSync = <Form extends object>(
	props: Props<Form>
): UseFormReturn<Form> => {
	const [hasRendered, setHasRendered] = useState<boolean>(false);
	const [params, setParams] = useSearchParamSync({
		syncFromParams: props.formFromParams,
		syncToParams: props.formToParams,
		syncFromParamsDependencies: props.formFromParamsDependencies
	});
	const form = useForm<Form>(props);
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
			setHasRendered(true);
		} else {
			reset(params);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [reset, params, hasRendered, setParams]);

	useEffect(() => {
		const subscription = watch((value) => {
			setParams(value as Form);
		});
		return subscription.unsubscribe;
	}, [watch, setParams]);

	return form;
};
