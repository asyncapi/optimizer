import { OptimizerInterface } from '../Models/OptimizerInterface';
import { ReportElement } from '../Models/Report';
import { ComponentProvider } from '../ComponentProvider';
import { AsyncAPIDocument } from '@asyncapi/parser';
import { compareComponents } from '../Utils';

export class MoveToComponents implements OptimizerInterface {
  provider: ComponentProvider;

  constructor(private document: AsyncAPIDocument) {
    this.provider = ComponentProvider.getInstance(document);
  }

  //yet to be implemented.
  getReport = (): ReportElement[] => {
    return this.findDuplicateComponents(this.provider.schemas, 'schema').concat(
      this.findDuplicateComponents(this.provider.messages, 'message'),
      this.findDuplicateComponents(this.provider.parameters, 'parameter')
    );
  }

  findDuplicateComponents = (components: Map<string, any>, componentType: string): ReportElement[] => {
    const elements = [] as ReportElement[];
    let counter = 1;
    for (const [key1, value1] of components) {
      let matchedKey = '';
      if (key1.startsWith('#/components/')) {
        continue;
      }
      for (const [key2, value2] of components) {
        if (value1.json() !== value2.json() && compareComponents(value1.json(),value2.json())) {
          if (key2.startsWith('#/components/')) {
            matchedKey = '';
            break;
          }
          matchedKey = key2;
        }
      }
      let alreadyMoved = false;
      if (matchedKey) {
        for (const reportElement of elements) {
          if (reportElement.path === matchedKey || reportElement.path === key1) {
            const newElement = {
              path: key1,
              action: 'reuse',
              target: reportElement.target
            };
            if (!elements.some(element => element.path === newElement.path)) {
              elements.push(newElement);
            }
            alreadyMoved = true;
            break;
          }
        }
        if (!alreadyMoved) {
          const target = `#/components/${componentType}s/${value1.json().name || `${componentType}-${counter++}`}`;
          elements.push({
            path: key1,
            action: 'move',
            target
          });
          elements.push({
            path: matchedKey,
            action: 'reuse',
            target
          });
        }
      }
    }
    // @ts-ignore
    elements.sort((a, b) => a.target.localeCompare(b.target));
    return elements;
  }
}
