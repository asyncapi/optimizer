import * as _ from 'lodash'
import YAML from 'js-yaml'
import { OptimizableComponentGroup, NewReport, ReportElement, OptimizableComponent } from 'index.d'

export const hasParent = (reportElement: ReportElement, asyncapiFile: any): boolean => {
  const childPath = reportElement.path
  const parentPath = childPath.substr(0, childPath.lastIndexOf('.'))
  const parent = _.get(asyncapiFile, parentPath)
  return !_.has(parent, '$ref')
}

export const createReport = (
  reportFn: any,
  optimizeableComponents: OptimizableComponentGroup[],
  reporterType: string
): NewReport => {
  const elements = optimizeableComponents
    .map((optimizeableComponent) => reportFn(optimizeableComponent))
    .flat()

  const type = reporterType
  return { type, elements }
}

export const sortReportElements = (report: NewReport): NewReport => {
  return {
    type: report.type,
    elements: report.elements.sort(
      (a, b) => a.action.length - b.action.length || b.path.length - a.path.length
    ),
  }
}
const isExtension = (fieldName: string): boolean => {
  return fieldName.startsWith('x-')
}

const backwardsCheck = (x: any, y: any): boolean => {
  for (const p in y) {
    if (_.has(y, p) && !_.has(x, p)) {
      return false
    }
  }
  return true
}

const compareComponents = (x: any, y: any): boolean => {
  // if they are not strictly equal, they both need to be Objects
  if (!(x instanceof Object) || !(y instanceof Object)) {
    return false
  }
  for (const p in x) {
    //extensions have different values for objects that are equal (duplicated.) If you don't skip the extensions this function always returns false.
    if (isExtension(p)) {
      continue
    }
    if (!_.has(x, p)) {
      continue
    }

    // allows to compare x[ p ] and y[ p ] when set to undefined
    if (!_.has(y, p)) {
      return false
    }

    // if they have the same strict value or identity then they are equal
    if (x[String(p)] === y[String(p)]) {
      continue
    }

    // Numbers, Strings, Functions, Booleans must be strictly equal
    if (typeof x[String(p)] !== 'object') {
      return false
    }

    // Objects and Arrays must be tested recursively
    if (!compareComponents(x[String(p)], y[String(p)])) {
      return false
    }
  }
  return backwardsCheck(x, y)
}

//Compares two components but also considers equality check. the referential equality check can be disabled by referentialEqualityCheck argument.
const isEqual = (component1: any, component2: any, referentialEqualityCheck: boolean): boolean => {
  if (referentialEqualityCheck) {
    return component1 === component2 || compareComponents(component1, component2)
  }
  return component1 !== component2 && compareComponents(component1, component2)
}

const isInComponents = (optimizableComponent: OptimizableComponent): boolean => {
  return optimizableComponent.path.startsWith('components.')
}

const isInChannels = (component: OptimizableComponent): boolean => {
  return component.path.startsWith('channels.')
}

const toJS = (asyncapiYAMLorJSON: any): any => {
  if (asyncapiYAMLorJSON.constructor && asyncapiYAMLorJSON.constructor.name === 'Object') {
    //NOTE: this approach can have problem with circular references between object and JSON.stringify doesn't support it.
    //more info: https://github.com/asyncapi/parser-js/issues/293
    return JSON.parse(JSON.stringify(asyncapiYAMLorJSON))
  }
  if (typeof asyncapiYAMLorJSON === 'string') {
    return YAML.load(asyncapiYAMLorJSON)
  }
  throw new Error(
    'Unknown input: Please make sure that your input is an Object/String of a valid AsyncAPI specification document.'
  )
}
export { compareComponents, isEqual, isInComponents, isInChannels, toJS }
