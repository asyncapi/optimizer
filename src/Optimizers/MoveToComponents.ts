import { OptimizerInterface } from '../Models/Optimizer';
import { ReportElement } from '../Models/Report';
import { ComponentProvider } from '../ComponentProvider';
import { AsyncAPIDocument } from '@asyncapi/parser';

export class MoveToComponents implements OptimizerInterface {
  provider: ComponentProvider;

  constructor(private document: AsyncAPIDocument) {
    this.provider = ComponentProvider.getInstance(document);
  }

  //yet to be implemented.
  getReport = (): ReportElement[] => {
    return [];
  }
}
