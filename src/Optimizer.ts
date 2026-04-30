import {
  NewReport,
  Report,
  ReportElement,
  Options,
  OptimizableComponentGroup,
  Reporter,
} from './types'
import { Parser } from '@asyncapi/parser'
import {
  removeComponents,
  reuseComponents,
  moveAllToComponents,
  moveDuplicatesToComponents,
} from './Reporters'
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
    this.reporters = [
      removeComponents,
      reuseComponents,
      moveAllToComponents,
      moveDuplicatesToComponents,
    ]
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
   * @property {Boolean=} moveAllToComponents - whether to move all AsyncAPI Specification-valid components to the `components` section or not. Defaults to `true`.
   * @property {Boolean=} moveDuplicatesToComponents - whether to move duplicated components to the `components` section or not. Defaults to `false`.
   */
  /**
   * @typedef {Object} DisableOptimizationFor
   * @property {Boolean=} schema - whether object `schema` should be excluded from the process of optimization (`true` instructs **not** to add calculated `schemas` to the optimized AsyncAPI Document.)
   */
  /**
   * @typedef {Object} Options
   * @property {Rules=} rules - the list of rules that specifies which type of optimizations should be applied.
   * @property {String=} output - specifies which type of output user wants, `'JSON'` or `'YAML'`. Defaults to `'YAML'`;
   * @property {DisableOptimizationFor=} disableOptimizationFor - the list of objects that should be excluded from the process of optimization.
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
        moveAllToComponents: true,
        moveDuplicatesToComponents: false, // there is no need to move duplicates if `moveAllToComponents` is `true`
      },
      output: Output.YAML,
      disableOptimizationFor: {
        schema: false,
      },
    }
    options = merge(defaultOptions, options)
    if (!this.reports) {
      throw new Error(
        'No report has been generated. please first generate a report by calling getReport method.'
      )
    }
    for (const report of this.reports) {
      if (options.disableOptimizationFor?.schema === true) {
        report.elements = report.elements.filter(
          (element) => !element.target?.includes('.schemas.')
        )
      }
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

  /**
   * Resolves a dot-notation lodash path string into an array of individual key segments,
   * using the actual object to correctly handle keys that contain dots in their names.
   *
   * For example, given the object `{ components: { messages: { "Unused-Event-1.0": {...} } } }`
   * and the path `"components.messages.Unused-Event-1.0"`, lodash would normally misinterpret
   * `Unused-Event-1.0` as `Unused-Event-1` → nested key `0`. This function checks the real
   * object at each level and greedily merges segments when a combined key exists.
   *
   * @param dotPath - A lodash dot-notation path string.
   * @param obj - The object to navigate for key-existence checks.
   * @returns An array of key segments that can be used safely with _.get / _.set / _.unset.
   */
  static resolveObjectPath(dotPath: string, obj: any): string[] {
    const parts = dotPath.split('.')
    const result: string[] = []
    let current = obj

    let i = 0
    while (i < parts.length) {
      if (current == null || typeof current !== 'object') {
        // Can't navigate further — append remaining parts as-is
        result.push(...parts.slice(i))
        break
      }

      const part = parts[i]

      if (part in current) {
        // Exact key match — use it directly
        result.push(part)
        current = current[part]
        i++
      } else {
        // Key not found at this level.  Try progressively combining more dot-separated
        // segments until we find a key that exists (handles keys containing dots).
        let found = false
        for (let j = i + 1; j <= parts.length; j++) {
          const combined = parts.slice(i, j).join('.')
          if (combined in current) {
            result.push(combined)
            current = current[combined]
            i = j
            found = true
            break
          }
        }
        if (!found) {
          // No matching key found even after combining — fall back to original segment
          result.push(part)
          current = undefined
          i++
        }
      }
    }

    return result
  }

  private applyReport(changes: ReportElement[]): void {
    const debug = Debug('optimizer:applyReport')
    for (const change of changes) {
      switch (change.action) {
        case Action.Move:
          _.set(this.outputObject, change.target as string, _.get(this.outputObject, change.path))
          _.set(this.outputObject, change.path, {
            $ref: `#/${toJsonPointer(change.target)}`,
          })
          debug('moved %s to %s', change.path, change.target)
          break

        case Action.Reuse:
          if (_.get(this.outputObject, change.target as string)) {
            _.set(this.outputObject, change.path, {
              $ref: `#/${toJsonPointer(change.target)}`,
            })
          }
          debug('%s reused %s', change.path, change.target)
          break

        case Action.Remove: {
          // Use object-aware path resolution so that keys containing dots (e.g. "Event.1.0")
          // are treated as a single segment rather than being split by lodash.
          const resolvedPath = Optimizer.resolveObjectPath(change.path, this.outputObject)
          _.unset(this.outputObject, resolvedPath)
          // If parent becomes empty after removing, parent should be removed as well.
          this.removeEmptyParent(change.path)
          debug('removed %s', change.path)
          break
        }
      }
    }
  }
}
/**
 * Converts a lodash-style path (e.g. `components.schemas.[0]`) to a valid
 * JSON Pointer path segment (e.g. `components/schemas/0`).
 * Lodash represents array indices as `[N]`, which is not valid in JSON Pointer
 * syntax where array indices must appear as plain integers without brackets.
 */
function toJsonPointer(lodashPath: string | undefined): string {
  if (!lodashPath) return ''
  return lodashPath
    .replace(/\.\[(\d+)\]/g, '/$1') // convert `.[N]` to `/N`
    .replace(/^\[(\d+)\]/g, '$1')   // convert leading `[N]` to `N`
    .replace(/\./g, '/')             // convert remaining `.` to `/`
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
