import type { AsyncAPIDocument } from '@asyncapi/parser'
import { OptimizableComponentGroup, OptimizableComponent } from 'index.d'

import { JSONPath } from 'jsonpath-plus'
import _ from 'lodash'

//the type of object should match exactly with one of the fixed fields in asyncapi components object.
const OPTIMIZABLE_PATHS = [
  {
    type: 'messages',
    paths: [
      '$.channels.*.*.message[?(@property !== "oneOf")]^',
      '$.channels.*.*.message.oneOf.*',
      '$.components.messages.*',
    ],
  },
  {
    type: 'schemas',
    paths: [
      '$.channels.*.*.message.traits[*]..[?(@.type)]',
      '$.channels.*.*.message.headers',
      '$.channels.*.*.message.headers..[?(@.type)]',
      '$.channels.*.*.message.payload',
      '$.channels.*.*.message.payload..[?(@.type)]',
      '$.channels.*.parameters.*.schema[?(@.type)]',
      '$.channels.*.parameters.*.schema..[?(@.type)]',
      '$.components.schemas..[?(@.type)]',
    ],
  },
  { type: 'parameters', paths: ['$.channels.*.parameters.*', '$.components.parameters.*'] },
]

export const toLodashPath = (path: string): string => {
  return path
    .replace(/'\]\['/g, '.')
    .slice(3, -2)
    .replace(/'\]/g, '')
    .replace(/\['/g, '.')
}

export const parseComponentsFromPath = (
  asyncAPIDocument: AsyncAPIDocument,
  paths: string[]
): OptimizableComponent[] => {
  return _.chain(paths)
    .map((path) => {
      return JSONPath({
        resultType: 'all',
        json: asyncAPIDocument.json(),
        path,
      })
    })
    .flatten()
    .map((component) => ({
      path: toLodashPath(component.path),
      component: component.value,
    }))
    .value()
}

export const getOptimizableComponents = (
  asyncAPIDocument: AsyncAPIDocument
): OptimizableComponentGroup[] => {
  const optimizeableComponents: OptimizableComponentGroup[] = []
  for (const componentsPaths of OPTIMIZABLE_PATHS) {
    optimizeableComponents.push({
      type: componentsPaths.type,
      components: parseComponentsFromPath(asyncAPIDocument, componentsPaths.paths),
    })
  }
  return optimizeableComponents
}
