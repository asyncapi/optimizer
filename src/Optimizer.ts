import { Report } from './Models/Report';
import { AsyncAPIDocument, parse } from '@asyncapi/parser';
import { RemoveComponents } from './Optimizers/RemoveComponents';
import { MoveToComponents } from './Optimizers/MoveToComponents';
import { ReuseComponents } from './Optimizers/ReuseComponents';
import { Options } from './Models/Options';
import { ReportElement } from './Models/Report';
import YAML from 'yaml';
import merge from 'merge-deep';
import * as _ from 'lodash';
/**
 * this class is the starting point of the library.
 * user will only interact with this class. here we generate different kind of reports using optimizers, apply changes and return the results to the user.
 *
 * @public
 */
export class Optimizer {
  reuseComponentsReport: ReportElement[] = [];
  removeComponentsReport: ReportElement[] = [];
  moveToComponentsReport: ReportElement[] = [];
  parsedDocument!: AsyncAPIDocument;
  outputObject = {};
  constructor(private YAMLorJSON: any) {
  }

  /**
   * @returns a {@link Report} object containing all of the optimizations that the library can do.
   * @public
   */
  getReport = async (): Promise<Report> => {
    this.parsedDocument = await parse(this.YAMLorJSON);

    const reuseComponents = new ReuseComponents(this.parsedDocument);
    this.reuseComponentsReport = reuseComponents.getReport();
    const removeComponents = new RemoveComponents(this.parsedDocument);
    this.removeComponentsReport = removeComponents.getReport();
    const moveToComponents = new MoveToComponents(this.parsedDocument);
    this.moveToComponentsReport = moveToComponents.getReport();

    return {
      reuseComponents: this.reuseComponentsReport,
      removeComponents: this.removeComponentsReport,
      moveToComponents: this.moveToComponentsReport
    };
  }

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
      this.applyChanges(this.moveToComponentsReport.sort((a,b) => b.path.length - a.path.length));
    }
    if (options.rules?.reuseComponents) {
      this.applyChanges(this.reuseComponentsReport);
    }
    if (options.rules?.removeComponents) {
      this.applyChanges(this.removeComponentsReport);
    }

    return YAML.stringify(this.outputObject);
  }
  applyChanges = (changes: ReportElement[]): void => {
    for (const change of changes) {
      switch (change.action) {
      case 'move':
        _.set(this.outputObject,change.target,_.get(this.outputObject,change.path));
        _.set(this.outputObject,change.path,{$ref: `#/${change.target?.replace(/\./g,'/')}`});
        break;
      case 'reuse':
        _.set(this.outputObject,change.path,{$ref: `#/${change.target?.replace(/\./g,'/')}`});
        break;
      case 'remove':
        _.unset(this.outputObject,change.path);
        break;
      }
    }
  }
}
