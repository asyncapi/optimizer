import { Action } from '../Optimizer'
import { OptimizableComponentGroup, ReportElement, Reporter } from '../index.d'
import { createReport, isEqual, isInChannels, isInComponents } from '../Utils'

const isChannelToComponent = (path1: string, path2: string): boolean => {
  return isInChannels(path1) && isInComponents(path2)
}

const findDuplicateComponents = (
  optimizableComponent: OptimizableComponentGroup
): ReportElement[] => {
  const elements = []
  for (const component1 of optimizableComponent.components) {
    for (const component2 of optimizableComponent.components) {
      if (
        component1.path === component2.path ||
        !isChannelToComponent(component1.path, component2.path)
      ) {
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
