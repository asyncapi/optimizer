import {
  NewReport,
  Report,
  ReportElement,
  Options,
  OptimizableComponentGroup,
  Reporter,
} from './index.d'
import { Parser } from '@asyncapi/parser'
import { removeComponents, reuseComponents, moveToComponents } from './Reporters'
import YAML from 'js-yaml'
import merge from 'merge-deep'
import * as _ from 'lodash'
import { getOptimizableComponents } from './ComponentProvider'
import { filterReportElements, hasParent, sortReportElements, toJS } from './Utils'
import Debug from 'debug'

export enum Action {
  Move = 'move',
  Remove = 'remove',
  Reuse = 'reuse',
}

export enum Output {
  JSON = 'JSON',
  YAML = 'YAML',
}
/**
 * this class is the starting point of the library.
 * user will only interact with this class. here we generate different kind of reports using optimizers, apply changes and return the results to the user.
 *
 * @public
 */
export class Optimizer {
  private components!: OptimizableComponentGroup[]
  private reporters: Reporter[]
  private reports: NewReport[] | undefined
  private outputObject = {}

  /**
   * @param {any} YAMLorJSON - YAML or JSON document that you want to optimize. You can pass Object, YAML or JSON version of your AsyncAPI document here.
   */
  constructor(private YAMLorJSON: any) {
    this.outputObject = toJS(this.YAMLorJSON)
    this.reporters = [removeComponents, reuseComponents, moveToComponents]
  }

  /**
   * @returns {Report} an object containing all of the optimizations that the library can do.
   *
   */
  async getReport(): Promise<Report> {
    const parser = new Parser()
    const parsedDocument = await parser.parse(this.YAMLorJSON, { applyTraits: false })
    if (!parsedDocument.document) {
      // eslint-disable-next-line no-undef, no-console
      console.error(parsedDocument.diagnostics)
      throw new Error('Parsing failed.')
    }
    this.components = getOptimizableComponents(parsedDocument.document)
    const rawReports = this.reporters.map((reporter) => reporter(this.components))
    const reportsWithParents = rawReports.map((report) => ({
      type: report.type,
      elements: report.elements.filter((reportElement) =>
        hasParent(reportElement, this.outputObject)
      ),
    }))

    const filteredReports = filterReportElements(reportsWithParents)
    const sortedReports = filteredReports.map((report) => sortReportElements(report))
    this.reports = sortedReports

    // since changing the report format is considered a breaking change, we are going to return the report in the old format.
    return convertToReportFormat(this.reports)
  }

  /**
   * @typedef {Object} Rules
   * @property {Boolean=} reuseComponents - whether to reuse components from `components` section or not. Defaults to `true`.
   * @property {Boolean=} removeComponents - whether to remove un-used components from `components` section or not. Defaults to `true`.
   * @property {Boolean=} moveToComponents - whether to move duplicated components to the `components` section or not. Defaults to `true`.
   */

  /**
   * @typedef {Object} Options
   * @property {Rules=} rules - the list of rules that specifies which type of optimizations should be applied.
   * @property {String=} output - specifies which type of output user wants, `'JSON'` or `'YAML'`. Defaults to `'YAML'`;
   */
  /**
   * This function is used to get the optimized document after seeing the report.
   *
   * @param {Options=} Options - the options are a way to customize the final output.
   * @returns {string } returns an stringified version of the YAML output.
   *
   */
  getOptimizedDocument(options?: Options): string {
    const defaultOptions = {
      rules: {
        reuseComponents: true,
        removeComponents: true,
        moveToComponents: true,
      },
      output: Output.YAML,
    }
    options = merge(defaultOptions, options)
    if (!this.reports) {
      throw new Error(
        'No report has been generated. please first generate a report by calling getReport method.'
      )
    }
    for (const report of this.reports) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      if (options.rules[report.type] === true) {
        this.applyReport(report.elements)
      }
    }

    if (options.output === Output.JSON) {
      return JSON.stringify(this.outputObject)
    }
    return YAML.dump(this.outputObject)
  }

  private removeEmptyParent(childPath: string): void {
    const parentPath = childPath.substring(0, childPath.lastIndexOf('.'))
    const parent = _.get(this.outputObject, parentPath)
    if (_.isEmpty(parent)) {
      _.unset(this.outputObject, parentPath)
    }
  }

  private applyReport(changes: ReportElement[]): void {
    const debug = Debug('optimizer:applyReport')
    for (const change of changes) {
      switch (change.action) {
        case Action.Move:
          _.set(this.outputObject, change.target as string, _.get(this.outputObject, change.path))
          _.set(this.outputObject, change.path, {
            $ref: `#/${change.target?.replace(/\./g, '/')}`,
          })
          debug('moved %s to %s', change.path, change.target)
          break

        case Action.Reuse:
          if (_.get(this.outputObject, change.target as string)) {
            _.set(this.outputObject, change.path, {
              $ref: `#/${change.target?.replace(/\./g, '/')}`,
            })
          }
          debug('%s reused %s', change.path, change.target)
          break

        case Action.Remove:
          _.unset(this.outputObject, change.path)
          //if parent becomes empty after removing, parent should be removed as well.
          this.removeEmptyParent(change.path)
          debug('removed %s', change.path)
          break
      }
    }
  }
}
function convertToReportFormat(reports: NewReport[]): Report {
  const result = {}
  for (const report of reports) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    result[report.type] = report.elements
  }
  return result as Report
}
