import { Action } from '../Optimizer'
import { OptimizableComponentGroup, ReportElement, Reporter } from '../index.d'
import { createReport, isEqual, isInComponents } from '../Utils'

const findUnusedComponents = (componentsGroup: OptimizableComponentGroup): ReportElement[] => {
  const elements = []
  for (const optimizableComponent1 of componentsGroup.components) {
    let isUsed = false
    if (!isInComponents(optimizableComponent1)) continue
    for (const optimizableComponent2 of componentsGroup.components) {
      if (optimizableComponent1.path === optimizableComponent2.path) continue
      if (isEqual(optimizableComponent1.component, optimizableComponent2.component, true)) {
        isUsed = true
      }
    }
    if (!isUsed) {
      const element: ReportElement = {
        path: optimizableComponent1.path,
        action: Action.Remove,
      }
      elements.push(element)
    }
  }
  return elements
}

export const removeComponents: Reporter = (optimizeableComponents) => {
  return createReport(findUnusedComponents, optimizeableComponents, 'removeComponents')
}
