import { OptimizerInterface } from '../Models/OptimizerInterface';
import { ReportElement } from '../Models/Report';
import { ComponentProvider } from '../ComponentProvider';
import { isEqual, isInComponents } from '../Utils';

export class MoveToComponents implements OptimizerInterface {
  provider: ComponentProvider;

  constructor(private componentProvider: ComponentProvider) {
    this.provider = componentProvider;
  }

  //yet to be implemented.
  getReport = (): ReportElement[] => {
    return this.findDuplicateComponents(this.provider.schemas, 'schema').concat(
      this.findDuplicateComponents(this.provider.messages, 'message'),
      this.findDuplicateComponents(this.provider.parameters, 'parameter')
    );
  }
  getMatch = (key: string, value: any, components: Map<string, any>): string => {
    let matchedKey = '';

    if (isInComponents(key)) {
      return '';
    }
    for (const [key2, value2] of components) {
      if (isEqual(value, value2, false)) {
        if (isInComponents(key2)) {
          matchedKey = '';
          break;
        }
        matchedKey = key2;
      }
    }
    return matchedKey;
  }
  reuseOldEntry = (key:string, matchedKey: string, elements: ReportElement[]): boolean => {
    for (const reportElement of elements) {
      if (reportElement.path === matchedKey || reportElement.path === key) {
        const newElement = {
          path: key,
          action: 'reuse',
          target: reportElement.target
        };

        if (!elements.some(element => element.path === newElement.path)) {
          elements.push(newElement);
        }
        return false;
      }
    }
    return true;
  }
  doesHaveACopy = (searchValue: any, components: Map<string, any>): boolean => {
    for (const [key, value] of components) {
      if (!isInComponents(key)) {continue; }

      if (isEqual(searchValue, value, true)) {
        return true;
      }
    }
    return false;
  }
  findDuplicateComponents = (components: Map<string, any>, componentType: string): ReportElement[] => {
    const elements = [] as ReportElement[];
    let counter = 1;
    for (const [key1, value1] of components) {
      const matchedKey = this.getMatch(key1, value1, components);

      if (!matchedKey) {continue;}
      const shouldCreateNewEntry = this.reuseOldEntry(key1, matchedKey, elements);

      if (!shouldCreateNewEntry) { continue; }
      
      //check if the component already has a copy in components section of the specification. If it already has then we don't need to apply this optimization. 
      //It will be taken care of by ReuseComponents
      if (this.doesHaveACopy(value1, components)) { continue; }
      const componentName = value1.json().name || `${componentType}-${counter++}`;
      const target = `components.${componentType}s.${componentName}`;
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
    return elements;
  }
}
