import './Welcome.scss';
import { PageTitle } from '../../UI/PageTitle';
import { PageResponsiveWrapper } from '../../UI/ResponsiveWrappers/PageResponsiveWrapper';

export const Welcome = () => (
	<PageResponsiveWrapper className="welcome">
		<PageTitle title="Welcome to Expense Tracker" />
	</PageResponsiveWrapper>
);
