import { getCommonContext } from '@hulk/common';
import { ReportBuilderPropsInterface } from './type';

export const {
  Provider: ReportBuilderProvider,
  useCommon: useReportBuilderCommon
} = getCommonContext<ReportBuilderPropsInterface>();
