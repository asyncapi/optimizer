import { Action } from '../Optimizer'
import {
  OptimizableComponent,
  OptimizableComponentGroup,
  ReportElement,
  Reporter,
} from '../index.d'
import { createReport, isEqual, isInChannels, isInComponents } from '../Utils'

const isChannelToComponent = (
  component1: OptimizableComponent,
  component2: OptimizableComponent
): boolean => {
  return isInChannels(component1) && isInComponents(component2)
}

const findDuplicateComponents = (
  optimizableComponent: OptimizableComponentGroup
): ReportElement[] => {
  const elements = []
  //compare components together and push a record in elements if a duplicated is found.
  for (const component1 of optimizableComponent.components) {
    for (const component2 of optimizableComponent.components) {
      if (component1.path === component2.path || !isChannelToComponent(component1, component2)) {
        continue
      }
      if (isEqual(component1.component, component2.component, false)) {
        const element: ReportElement = {
          path: component1.path,
          action: Action.Reuse,
          target: component2.path,
        }
        elements.push(element)
        break
      }
    }
  }
  return elements
}

export const reuseComponents: Reporter = (optimizeableComponents) => {
  return createReport(findDuplicateComponents, optimizeableComponents, 'reuseComponents')
}
