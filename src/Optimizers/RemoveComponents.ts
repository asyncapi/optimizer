import { OptimizerInterface } from '../Models/OptimizerInterface';
import { ReportElement } from '../Models/Report';
import { ComponentProvider } from '../ComponentProvider';
import { isEqual, isInComponents } from '../Utils';

export class RemoveComponents implements OptimizerInterface {
  provider: ComponentProvider;

  constructor(private componentProvider: ComponentProvider) {
    this.provider = componentProvider;
  }

  getReport = (): ReportElement[] => {
    return this.findUnusedComponents(this.provider.schemas).concat(
      this.findUnusedComponents(this.provider.messages),
      this.findUnusedComponents(this.provider.parameters)
    );
  }

  findUnusedComponents = (components: Map<string, any>): ReportElement[] => {
    const elements = [];
    for (const [key1, value1] of components) {
      let isUsed = false;
      if (!isInComponents(key1)) {
        continue;
      }
      for (const [key2, value2] of components) {
        if (key1 === key2) {
          continue;
        }
        if (isEqual(value1, value2, true)) {
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
