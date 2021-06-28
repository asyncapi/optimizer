import { ReportElement } from '../Models/Report';
import { AsyncAPIDocument } from '@asyncapi/parser';
import { ComponentProvider } from '../ComponentProvider';
import { compareMessages, compareSchemas } from '../Utils';
import { OptimizerInterface } from '../Models/Optimizer';

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
    const arr = [...component].map(([path, object]) => ({path, object}));

    for (const [key1, value1] of component) {
      for (const [key2, value2] of component) {
        if (key1 === key2 || !this.isChannelToComponent(key1, key2)) {continue;}
        if (value1.json().hasOwnProperty('x-parser-schema-id') && compareSchemas(value1.json(), value2.json))
      }
    }

    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length; j++) {
        let compareResult = false;
        switch (componentType) {
        case 'schema':
          compareResult = compareSchemas(arr[i].object.json(), arr[j].object.json());
          break;
        case 'message':
          compareResult = compareMessages(arr[i].object, arr[j].object);
          break;
        case 'parameter':
          compareResult = compareMessages(arr[i].object, arr[j].object);
        }
        if (i !== j && this.isChannelToComponent(arr[i].path, arr[j].path, componentType) && compareResult) {
          const element: ReportElement = {
            path: arr[i].path,
            action: 'reuse',
            target: arr[j].path
          };
          elements.push(element);
          break;
        }
      }
    }
    return elements;
  }
  isChannelToComponent = (object1: string, object2: string): boolean => {
    return object1.startsWith('#/channels') && object2.startsWith('#/components/');
  }
}