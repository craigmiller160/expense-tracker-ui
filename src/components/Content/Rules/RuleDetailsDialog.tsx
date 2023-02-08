import { OptionT } from '@craigmiller160/ts-functions/es/types';
import { useHandleRuleDialogData } from './useHandleRuleDialogData';
import { SideDialog } from '../../UI/SideDialog';
import { Button, CircularProgress } from '@mui/material';
import './RuleDetailsDialog.scss';
import { ResponsiveRow } from '../../UI/ResponsiveWrappers/ResponsiveRow';
import {
	Autocomplete,
	DatePicker,
	TextField
} from '@craigmiller160/react-hook-form-material-ui';
import { formatAmountValue } from '../../../utils/amountUtils';
import * as Option from 'fp-ts/es6/Option';

type ActionsProps = {
	readonly deleteRule: () => void;
	readonly enableSaveButton: boolean;
	readonly showDeleteButton: boolean;
};

const RuleDetailsDialogActions = (props: ActionsProps) => (
	<div className="AutoCategorizeRuleDetailsActions">
		<Button
			color="success"
			variant="contained"
			disabled={!props.enableSaveButton}
			type="submit"
		>
			Save
		</Button>
		{props.showDeleteButton && (
			<Button
				color="error"
				variant="contained"
				onClick={props.deleteRule}
			>
				Delete
			</Button>
		)}
	</div>
);

type Props = {
	readonly open: boolean;
	readonly close: () => void;
	readonly clearSelectedRule: () => void;
	readonly selectedRuleId: OptionT<string>;
};

export const RuleDetailsDialog = (props: Props) => {
	const {
		isFetching,
		ordinalOptions,
		categoryOptions,
		form: {
			handleSubmit,
			control,
			formState: { isDirty, isValid }
		},
		saveRule,
		deleteRule
	} = useHandleRuleDialogData({
		selectedRuleId: props.selectedRuleId,
		open: props.open,
		close: props.close,
		clearSelectedRule: props.clearSelectedRule
	});

	const Actions = !isFetching ? (
		<RuleDetailsDialogActions
			deleteRule={deleteRule}
			enableSaveButton={isDirty && isValid}
			showDeleteButton={Option.isSome(props.selectedRuleId)}
		/>
	) : undefined;

	return (
		<SideDialog
			id="RuleDetailsDialog"
			title="Rule Details"
			open={props.open}
			onClose={props.close}
			formSubmit={handleSubmit(saveRule)}
			actions={Actions}
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
							sm: '80%'
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
					<hr />
					<ResponsiveRow>
						<DatePicker
							control={control}
							name="startDate"
							label="Start Date"
						/>
						<DatePicker
							control={control}
							name="endDate"
							label="End Date"
						/>
					</ResponsiveRow>
					<ResponsiveRow>
						<TextField
							control={control}
							name="minAmount"
							label="Min Amount ($)"
							onBlurTransform={formatAmountValue}
						/>
						<TextField
							control={control}
							name="maxAmount"
							label="Max Amount ($)"
							onBlurTransform={formatAmountValue}
						/>
					</ResponsiveRow>
					<hr />
				</div>
			)}
		</SideDialog>
	);
};
