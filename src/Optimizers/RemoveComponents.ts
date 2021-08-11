import { Action, OptimizerInterface, ReportElement } from '../Models';
import { ComponentProvider } from '../ComponentProvider';
import { isEqual, isInComponents } from '../Utils';
/**
 * This optimizer will find all of the components that are declared in _components_ section of the AsyncAPI spec but are not used anywhere. So they can be deleted.
 *
 * @private
 */
export class RemoveComponents implements OptimizerInterface {
  provider: ComponentProvider;

  constructor(private componentProvider: ComponentProvider) {
    this.provider = componentProvider;
  }

  /**
   * After initializing this class, getReport function can be used to generate a report of components that can be deleted since they are declared but are not used.
   *
   * @returns {ReportElement[]} a list of all the components that can be removed.
   */
  getReport = (): ReportElement[] => {
    return this.findUnusedComponents(this.provider.schemas).concat(
      this.findUnusedComponents(this.provider.messages),
      this.findUnusedComponents(this.provider.parameters)
    );
  }

  private findUnusedComponents = (components: Map<string, any>): ReportElement[] => {
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
          action: Action.Remove,
        };
        elements.push(element);
      }
    }
    return elements;
  }
}
