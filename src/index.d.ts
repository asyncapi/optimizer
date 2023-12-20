import { Action, Output } from 'Optimizer'

export interface ReportElement {
  path: string
  action: Action
  target?: string
}
export type OptimizableComponent = {
  path: string
  component: any
}
export type OptimizableComponentGroup = {
  type: string
  components: OptimizableComponent[]
}

//Keeping this format for compatibility reasons. (we can remove this in the next major version)
export interface Report {
  reuseComponents?: ReportElement[]
  removeComponents?: ReportElement[]
  moveDuplicatesToComponents?: ReportElement[]
}

//In the next major version we can rename this to `Report` and use this format instead.
export interface NewReport {
  type: string
  elements: ReportElement[]
}

export type Reporter = (optimizeableComponents: OptimizableComponentGroup[]) => NewReport

interface Rules {
  reuseComponents?: boolean
  removeComponents?: boolean
  moveDuplicatesToComponents?: boolean
}
export interface Options {
  rules?: Rules
  output?: Output
}

export interface IOptimizer {
  getReport: () => ReportElement[]
}
