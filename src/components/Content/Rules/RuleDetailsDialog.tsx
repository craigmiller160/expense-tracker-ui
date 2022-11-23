import { OptionT } from '@craigmiller160/ts-functions/es/types';
import { useHandleRuleDialogData } from './useHandleRuleDialogData';
import { SideDialog } from '../../UI/SideDialog';
import { CircularProgress } from '@mui/material';
import './RuleDetailsDialog.scss';
import { ResponsiveRow } from '../../UI/ResponsiveWrappers/ResponsiveRow';
import {
	Autocomplete,
	TextField
} from '@craigmiller160/react-hook-form-material-ui';

type Props = {
	readonly open: boolean;
	readonly close: () => void;
	readonly selectedRuleId: OptionT<string>;
};

// TODO how to add ordinal control?
export const RuleDetailsDialog = (props: Props) => {
	const {
		isFetching,
		ordinalOptions,
		categoryOptions,
		form: { handleSubmit, control }
	} = useHandleRuleDialogData({
		selectedRuleId: props.selectedRuleId,
		open: props.open
	});

	const onSubmit = () => {
		// TODO finish this
		throw new Error();
	};

	// TODO concerned about widths here, tweak it via the ResponsiveRow component and compare with TransactionDialog
	return (
		<SideDialog
			title="Rule Details"
			open={props.open}
			onClose={props.close}
			formSubmit={handleSubmit(onSubmit)}
		>
			{isFetching && <CircularProgress />}
			{!isFetching && (
				<div className="AutoCategorizeRuleDetailsForm">
					<ResponsiveRow>
						<Autocomplete
							options={ordinalOptions}
							control={control}
							name="ordinal"
							label="Ordinal"
							rules={{
								required: 'Ordinal is required'
							}}
						/>
						<Autocomplete
							options={categoryOptions}
							control={control}
							name="category"
							label="Category"
							rules={{
								required: 'Category is required'
							}}
						/>
					</ResponsiveRow>
					<ResponsiveRow
						overrideChildWidth={{
							sm: '100%',
							xl: '100%'
						}}
					>
						<TextField
							control={control}
							name="regex"
							label="Regex"
							rules={{
								required: 'Regex is required'
							}}
						/>
					</ResponsiveRow>
					<ResponsiveRow>
						<p>Start Date</p>
						<p>End Date</p>
					</ResponsiveRow>
					<ResponsiveRow>
						<p>Min Amount</p>
						<p>Max Amount</p>
					</ResponsiveRow>
				</div>
			)}
		</SideDialog>
	);
};
