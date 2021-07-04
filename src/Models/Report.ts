export interface ReportElement {
  path: string;
  action: string;
  target?: string;
}

export interface Report {
  reuseComponents?: ReportElement[];
  removeComponents?: ReportElement[];
  moveToComponents?: ReportElement[];
}
