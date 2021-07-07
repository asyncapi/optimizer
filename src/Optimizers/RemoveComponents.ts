import { OptimizerInterface } from '../Models/OptimizerInterface';
import { ReportElement } from '../Models/Report';
import { ComponentProvider } from '../ComponentProvider';
import { AsyncAPIDocument } from '@asyncapi/parser';
import { compareComponents } from '../Utils';

export class RemoveComponents implements OptimizerInterface {
  provider: ComponentProvider;

  constructor(private document: AsyncAPIDocument) {
    this.provider = ComponentProvider.getInstance(document);
  }

  getReport = (): ReportElement[] => {
    return this.findUnusedComponents(this.provider.parameters);
  }

  findUnusedComponents = (components: Map<string, any>): ReportElement[] => {
    const elements = [];
    for (const [key1, value1] of components) {
      let isUsed = false;
      if (!key1.startsWith('#/components/')) {
        continue;
      }
      for (const [key2, value2] of components) {
        if (key1 === key2) {
          continue;
        }
        if (value1.json() === value2.json() || compareComponents(value1.json(), value2.json())) {
          isUsed = true;
        }
      }
      if (!isUsed) {
        const element: ReportElement = {
          path: key1,
          action: 'remove',
        };
        elements.push(element);
      }
    }
    return elements;
  }
}
