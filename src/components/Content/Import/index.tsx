import './ImportTransactions.scss';
import { Typography } from '@mui/material';
import { useImmer } from 'use-immer';
import { expenseTrackerApi } from '../../../ajaxapi/service/AjaxApi';

interface State {
	readonly file: any;
}

export const Import = () => {
	const [state, setState] = useImmer<State>({
		file: null
	});
	const onChange = (event: any) => {
		console.log('Event', event.target.files[0]);
		setState((draft) => {
			draft.file = event.target.files[0];
		});
	};

	const doSubmit = () => {
		console.log('submitting');
		const form = new FormData();
		form.append('file', state.file);
		expenseTrackerApi.post<FormData, unknown>({
			uri: '/transaction-import?type=DISCOVER_CSV',
			body: form
		});
	};

	return (
		<div className="ImportTransactions">
			<div className="TitleWrapper">
				<Typography variant="h4">Import Transactions</Typography>
			</div>
			<input type="file" onChange={onChange} />
			<button onClick={doSubmit}>Submit</button>
		</div>
	);
};
