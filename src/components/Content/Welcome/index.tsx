import './Welcome.scss';
import { PageTitle } from '../../UI/PageTitle';
import { PageResponsiveWrapper } from '../../UI/ResponsiveWrappers/PageResponsiveWrapper';

export const Welcome = () => (
	<PageResponsiveWrapper className="Welcome">
		<PageTitle title="Welcome to Expense Tracker" />
	</PageResponsiveWrapper>
);
