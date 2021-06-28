import { OptimizerInterface } from '../Models/Optimizer';
import { ReportElement } from '../Models/Report';
import { ComponentProvider } from '../ComponentProvider';
import { AsyncAPIDocument } from '@asyncapi/parser';

export class RemoveComponents implements OptimizerInterface {
  provider: ComponentProvider;

  constructor(private document: AsyncAPIDocument) {
    this.provider = ComponentProvider.getInstance(document);
  }

  //Yet to be implemented.
  getReport = (): ReportElement[] => {
    return [];
  }
}
