import { Action, OptimizerInterface, ReportElement } from '../Models';
import { ComponentProvider } from '../ComponentProvider';
import { isEqual, isInChannels, isInComponents } from '../Utils';

/**
 * This optimizer will find all of the components that are declared in _components_ section of the AsyncAPI spec that can be reused in other part of the spec and generate a detailed report of them.
 *
 * @private
 */
export class ReuseComponents implements OptimizerInterface {
  provider: ComponentProvider;

  constructor(private componentProvider: ComponentProvider) {
    this.provider = componentProvider;
  }

  /**
   * After initializing this class, getReport function can be used to generate a report of components that can be reused.
   *
   * @returns {ReportElement[]} a list of elements that can be reused.
   */
  getReport(): ReportElement[] {
    return this.findDuplicateComponents(this.provider.schemas).concat(
      this.findDuplicateComponents(this.provider.messages),
      this.findDuplicateComponents(this.provider.parameters)
    );
  }

  private findDuplicateComponents(component: Map<string, any>): ReportElement[] {
    const elements = [];
    for (const [key1, value1] of component) {
      for (const [key2, value2] of component) {
        if (key1 === key2 || !this.isChannelToComponent(key1, key2)) {
          continue;
        }

        if (isEqual(value1, value2, false)) {
          const element: ReportElement = {
            path: key1,
            action: Action.Reuse,
            target: key2
          };
          elements.push(element);
          break;
        }
      }
    }
    return elements;
  }
  private isChannelToComponent(path1: string, path2: string): boolean {
    return isInChannels(path1) && isInComponents(path2);
  }
}
