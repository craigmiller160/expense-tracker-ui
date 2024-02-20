import { test } from 'vitest';
import type { ReportPageResponse } from '../../../../src/types/generated/expense-tracker';
import reportResponseForExtension from '../../../__data__/report_response_for_extension.json';

const data: ReportPageResponse = reportResponseForExtension;

test.fails('extends report data');
