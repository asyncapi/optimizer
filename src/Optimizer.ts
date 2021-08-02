import { Report, ReportElement } from './Models/Report';
import { parse } from '@asyncapi/parser';
import { RemoveComponents } from './Optimizers/RemoveComponents';
import { MoveToComponents } from './Optimizers/MoveToComponents';
import { ReuseComponents } from './Optimizers/ReuseComponents';
import { Options } from './Models/Options';
import YAML from 'yaml';
import merge from 'merge-deep';
import * as _ from 'lodash';
import { ComponentProvider } from './ComponentProvider';
/**
 * this class is the starting point of the library.
 * user will only interact with this class. here we generate different kind of reports using optimizers, apply changes and return the results to the user.
 *
 * @public
 */
export class Optimizer {
  componentProvider!: ComponentProvider;
  reuseComponentsReport: ReportElement[] = [];
  removeComponentsReport: ReportElement[] = [];
  moveToComponentsReport: ReportElement[] = [];
  outputObject = {};
  constructor(private YAMLorJSON: any) {

  }

  /**
   * @returns a {@link Report} object containing all of the optimizations that the library can do.
   * @public
   */
  getReport = async (): Promise<Report> => {
    if (!this.componentProvider) {
      const parsedDocument = await parse(this.YAMLorJSON);
      this.componentProvider = new ComponentProvider(parsedDocument);
    }
    const reuseComponents = new ReuseComponents(this.componentProvider);
    this.reuseComponentsReport = reuseComponents.getReport();
    const removeComponents = new RemoveComponents(this.componentProvider);
    this.removeComponentsReport = removeComponents.getReport();
    const moveToComponents = new MoveToComponents(this.componentProvider);
    this.moveToComponentsReport = moveToComponents.getReport();

    return {
      reuseComponents: this.reuseComponentsReport,
      removeComponents: this.removeComponentsReport,
      moveToComponents: this.moveToComponentsReport
    };
  }
  sortFunction = (a: ReportElement, b: ReportElement): number => b.path.length - a.path.length;
  getOptimizedDocument = (options: Options): string => {
    const defaultOptions = {
      rules: {
        reuseComponents: true,
        removeComponents: true,
        moveToComponents: true
      }
    };
    options = merge(defaultOptions, options);
    this.outputObject = YAML.parse(this.YAMLorJSON);
    if (options.rules?.moveToComponents) {
      this.moveToComponentsReport.sort(this.sortFunction);
      this.applyChanges(this.moveToComponentsReport);
    }
    if (options.rules?.reuseComponents) {
      this.applyChanges(this.reuseComponentsReport);
    }
    if (options.rules?.removeComponents) {
      this.applyChanges(this.removeComponentsReport);
    }

    return YAML.stringify(this.outputObject);
  }
  removeEmptyParent = (childPath: string): void => {
    const parentPath = childPath.substr(0, childPath.lastIndexOf('.'));
    const parent = _.get(this.outputObject, parentPath);
    if (Object.keys(parent).length === 0) {
      _.unset(this.outputObject, parentPath);
    }
  }
  applyChanges = (changes: ReportElement[]): void => {
    for (const change of changes) {
      switch (change.action) {
      case 'move':
        if (change.target) {
          _.set(this.outputObject, change.target, _.get(this.outputObject, change.path));
          _.set(this.outputObject, change.path, { $ref: `#/${change.target?.replace(/\./g, '/')}` });
        } else {
          throw new Error('The target of report element for "move" should NOT be empty.');
        }
        break;
      case 'reuse':
        _.set(this.outputObject, change.path, { $ref: `#/${change.target?.replace(/\./g, '/')}` });
        break;
      case 'remove':
        _.unset(this.outputObject, change.path);
        //if parent becomes empty after removing, parent should be removed as well.
        this.removeEmptyParent(change.path);
        break;
      }
    }
  }
}
