import { Action } from '../Optimizer'
import { createReport, isEqual, isInComponents } from '../Utils'
import { OptimizableComponentGroup, ReportElement, Reporter } from 'index.d'

const getMatch = (
  key: string,
  value: any,
  optimizableComponentGroup: OptimizableComponentGroup
): string => {
  let matchedKey = ''

  if (isInComponents(key)) {
    return ''
  }
  for (const optimizableComponent of optimizableComponentGroup.components) {
    if (isEqual(value, optimizableComponent.component, false)) {
      if (isInComponents(optimizableComponent.path)) {
        matchedKey = ''
        break
      }
      matchedKey = optimizableComponent.path
    }
  }
  return matchedKey
}
const reuseOldEntry = (key: string, matchedKey: string, elements: ReportElement[]): boolean => {
  for (const reportElement of elements) {
    if (reportElement.path === matchedKey || reportElement.path === key) {
      const newElement = {
        path: key,
        action: Action.Reuse,
        target: reportElement.target,
      }

      if (!elements.some((element) => element.path === newElement.path)) {
        elements.push(newElement)
      }
      return false
    }
  }
  return true
}
const doesHaveACopy = (searchValue: any, components: OptimizableComponentGroup): boolean => {
  for (const optimizableComponent of components.components) {
    if (!isInComponents(optimizableComponent.path)) {
      continue
    }

    if (isEqual(searchValue, optimizableComponent.component, true)) {
      return true
    }
  }
  return false
}

const findDuplicateComponents = (
  optimizableComponentGroup: OptimizableComponentGroup
): ReportElement[] => {
  const elements = [] as ReportElement[]
  let counter = 1
  for (const optimizableComponent1 of optimizableComponentGroup.components) {
    const matchedKey = getMatch(
      optimizableComponent1.path,
      optimizableComponent1.component,
      optimizableComponentGroup
    )
    if (!matchedKey) {
      continue
    }
    const shouldCreateNewEntry = reuseOldEntry(optimizableComponent1.path, matchedKey, elements)

    if (!shouldCreateNewEntry) {
      continue
    }

    //check if the component already has a copy in components section of the specification. If it already has then we don't need to apply this optimization.
    //It will be taken care of by ReuseComponents

    if (doesHaveACopy(optimizableComponent1.component, optimizableComponentGroup)) {
      continue
    }
    const componentName =
      optimizableComponent1.component.name ||
      `${optimizableComponentGroup.type.slice(0, -1)}-${counter++}`
    const target = `components.${optimizableComponentGroup.type}.${componentName}`
    elements.push({
      path: optimizableComponent1.path,
      action: Action.Move,
      target,
    })
    elements.push({
      path: matchedKey,
      action: Action.Reuse,
      target,
    })
  }
  return elements
}

export const moveToComponents: Reporter = (optimizableComponentsGroup) => {
  return createReport(findDuplicateComponents, optimizableComponentsGroup, 'moveToComponents')
}
