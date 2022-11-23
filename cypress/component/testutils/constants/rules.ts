import rawAllRules from '../../../fixtures/allRules.json';
import { AutoCategorizeRulePageResponse } from '../../../../src/types/generated/expense-tracker';

export const allRules = rawAllRules as AutoCategorizeRulePageResponse;
export const columnNames = ['Ordinal', 'Category', 'Rule'];
