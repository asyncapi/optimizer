import { Action, Report, ReportElement, Options } from './Models';
import { parse } from '@asyncapi/parser';
import { RemoveComponents, ReuseComponents, MoveToComponents } from './Optimizers';
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
   * @returns {Report} an object containing all of the optimizations that the library can do.
   *
   */
  getReport = async (): Promise<Report> => {
    if (!this.componentProvider) {
      const parsedDocument = await parse(this.YAMLorJSON, { applyTraits: false });
      this.componentProvider = new ComponentProvider(parsedDocument);
    }
    const reuseComponents = new ReuseComponents(this.componentProvider);
    this.reuseComponentsReport = reuseComponents.getReport();
    this.reuseComponentsReport.sort(this.sortFunction);
    const removeComponents = new RemoveComponents(this.componentProvider);
    this.removeComponentsReport = removeComponents.getReport();
    this.removeComponentsReport.sort(this.sortFunction);
    const moveToComponents = new MoveToComponents(this.componentProvider);
    this.moveToComponentsReport = moveToComponents.getReport();
    this.moveToComponentsReport.sort(this.sortFunction);

    return {
      reuseComponents: this.reuseComponentsReport,
      removeComponents: this.removeComponentsReport,
      moveToComponents: this.moveToComponentsReport
    };
  }

  /**
   * this sort function can be used by .sort function to sort the {@link ReportElement} arrays.
   *
   * @private
   */
  private sortFunction = (a: ReportElement, b: ReportElement): number => { return (a.action.length - b.action.length || b.path.length - a.path.length);};

  /**
   * This function is used to get the optimized document after seeing the report.
   *
   * @param {Options} options - the options are a way to customize the final output.
   * @returns {string } returns an stringified version of the YAML output.
   *
   */
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
    if (options.rules?.reuseComponents) {
      this.applyChanges(this.reuseComponentsReport);
    }
    if (options.rules?.moveToComponents) {
      this.applyChanges(this.moveToComponentsReport);
    }
    if (options.rules?.removeComponents) {
      this.applyChanges(this.removeComponentsReport);
    }

    return YAML.stringify(this.outputObject);
  }

  /**
   * Sometimes removing and optimizing components leaves the parent empty and an empty object is of no use. this function
   * checks if the parent is empty or not, if empty it will remove it.
   *
   * @private
   * @param {string} childPath - the path of the child that we need to check its parent.
   * @returns {void}
   *
   */
  private removeEmptyParent = (childPath: string): void => {
    const parentPath = childPath.substr(0, childPath.lastIndexOf('.'));
    const parent = _.get(this.outputObject, parentPath);
    if (_.isEmpty(parent)) {
      _.unset(this.outputObject, parentPath);
    }
  }
  /**
   * this function will check if a component has parent or is a $ref to another component.
   *
   * @private
   * @param {string} childPath - the path of child.
   * @returns {void}
   *
   */
  private hasParent = (childPath: string): boolean => {
    const parentPath = childPath.substr(0, childPath.lastIndexOf('.'));
    const parent = _.get(this.outputObject, parentPath);
    return !(_.has(parent, '$ref'));
  }
  /**
   * This function is used to apply an array of {@link ReportElement} changes on the result.
   *
   * @private
   * @param {ReportElement[]} changes - A list of changes that needs to be applied.
   * @returns {void}
   *
   */
  private applyChanges = (changes: ReportElement[]): void => {
    for (const change of changes) {
      if (!this.hasParent(change.path)) {
        continue;
      }
      switch (change.action) {
      case Action.Move:
        _.set(this.outputObject, change.target as string, _.get(this.outputObject, change.path));
        _.set(this.outputObject, change.path, { $ref: `#/${change.target?.replace(/\./g, '/')}` });
        break;

      case Action.Reuse:
        if (_.get(this.outputObject, change.target as string)) {
          _.set(this.outputObject, change.path, { $ref: `#/${change.target?.replace(/\./g, '/')}` });
        }
        break;

      case Action.Remove:
        _.unset(this.outputObject, change.path);
        //if parent becomes empty after removing, parent should be removed as well.
        this.removeEmptyParent(change.path);
        break;
      }
    }
  }
}
