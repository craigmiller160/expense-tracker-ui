import reportCategories from '../../../__data__/report_categories.json';
import { sortCategories } from '../../../../src/components/Content/Reports/SpendingByCategoryTable';
import { ReportCategoryResponse } from '../../../../src/types/generated/expense-tracker';

const getName = (cat: ReportCategoryResponse): string => cat.name;

describe('SpendingByCategoryTable', () => {
	describe('sort by functions', () => {
		it('sorts by category', () => {
			const result =
				sortCategories('CATEGORY')(reportCategories).map(getName);
			expect(result).toEqual([
				'Entertainment',
				'Groceries',
				'Restaurants',
				'Travel',
				'Unknown'
			]);
		});

		it('sorts by amount', () => {
			const result =
				sortCategories('AMOUNT')(reportCategories).map(getName);
			expect(result).toEqual([
				'Groceries',
				'Restaurants',
				'Entertainment',
				'Unknown',
				'Travel'
			]);
		});
	});
});
