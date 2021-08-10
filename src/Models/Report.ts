import { Action } from './Enums';

export interface ReportElement {
  path: string;
  action: Action;
  target?: string;
}

export interface Report {
  reuseComponents?: ReportElement[];
  removeComponents?: ReportElement[];
  moveToComponents?: ReportElement[];
}
