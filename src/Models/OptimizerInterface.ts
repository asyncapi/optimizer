import { ReportElement } from './Report';

/**
 * This interface will be implemented by all Optimizers.
 *
 * @public
 */
export interface OptimizerInterface {
  getReport: () => ReportElement[];
}
