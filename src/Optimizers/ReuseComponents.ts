import { ReportElement } from '../Models/Report';
import { AsyncAPIDocument } from '@asyncapi/parser';
import { ComponentProvider } from '../ComponentProvider';
import { isEqual, isInChannels, isInComponents } from '../Utils';
import { OptimizerInterface } from '../Models/OptimizerInterface';

/**
 * This optimizer will find all of the components that are declared in _components_ section of the AsyncAPI spec that can be reused in other part of the spec and generate a detailed report of them.
 *
 * @public
 */
export class ReuseComponents implements OptimizerInterface {
  provider: ComponentProvider;

  constructor(private document: AsyncAPIDocument) {
    this.provider = ComponentProvider.getInstance(document);
  }

  /**
   * After initializing this class, getReport function can be used to generate a report of components that can be reused.
   *
   * @returns ReportElement[]
   * @defaultValue `true`
   */
  getReport = (): ReportElement[] => {
    return this.findDuplicateComponents(this.provider.schemas).concat(
      this.findDuplicateComponents(this.provider.messages),
      this.findDuplicateComponents(this.provider.parameters)
    );
  }

  findDuplicateComponents = (component: Map<string, any>): ReportElement[] => {
    const elements = [];
    for (const [key1, value1] of component) {
      for (const [key2, value2] of component) {
        if (key1 === key2 || !this.isChannelToComponent(key1, key2)) {
          continue;
        }
        if (isEqual(value1,value2,false)) {
          const element: ReportElement = {
            path: key1,
            action: 'reuse',
            target: key2
          };
          elements.push(element);
          break;
        }
      }
    }
    return elements;
  }
    isChannelToComponent = (path1: string, path2: string): boolean => {
      return isInChannels(path1) && isInComponents(path2);
    }
}
