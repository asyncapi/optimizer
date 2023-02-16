import { Action } from '../Optimizer'
import { createReport, isEqual, isInComponents } from '../Utils'
import { OptimizableComponent, OptimizableComponentGroup, ReportElement, Reporter } from 'index.d'

/**
 *
 * @param optimizableComponentGroup components that you want to analyze for duplicates.
 * @returns A list of optimization report elements.
 */
const findDuplicateComponents = (
  optimizableComponentGroup: OptimizableComponentGroup
): ReportElement[] => {
  const allComponents = optimizableComponentGroup.components
  const insideComponentsSection = allComponents.filter(isInComponents)
  const outsideComponentsSecion = getOutsideComponents(allComponents, insideComponentsSection)

  const resultElements: ReportElement[] = []

  let counter = 1

  for (const [index, component] of outsideComponentsSecion.entries()) {
    for (const compareComponent of outsideComponentsSecion.slice(index + 1)) {
      if (isEqual(component.component, compareComponent.component, false)) {
        const existingResult = resultElements.filter(
          (reportElement) => component.path === reportElement.path
        )[0]
        if (!existingResult) {
          const componentName =
            component.component.name ||
            `${optimizableComponentGroup.type.slice(0, -1)}-${counter++}`
          const target = `components.${optimizableComponentGroup.type}.${componentName}`
          resultElements.push({
            path: component.path,
            action: Action.Move,
            target,
          })
          resultElements.push({
            path: compareComponent.path,
            action: Action.Reuse,
            target,
          })
        } else {
          resultElements.push({
            path: component.path,
            action: Action.Reuse,
            target: existingResult.target,
          })
        }
      }
    }
  }

  return resultElements
}

export const moveToComponents: Reporter = (optimizableComponentsGroup) => {
  return createReport(findDuplicateComponents, optimizableComponentsGroup, 'moveToComponents')
}

function getOutsideComponents(
  allComponents: OptimizableComponent[],
  insideComponentsSection: OptimizableComponent[]
) {
  return allComponents.filter(
    (component) =>
      !isInComponents(component) &&
      insideComponentsSection.filter((inCSC) => isEqual(component.component, inCSC.component, true))
        .length === 0
  )
}
