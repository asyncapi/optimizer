import type {
  AsyncAPIDocument,
  ChannelParameter,
  Message,
  Schema,
} from '@asyncapi/parser';

import { JSONPath } from 'jsonpath-plus';
import _ from 'lodash';
/**
 * This class will provide all sorts of data for optimizers.
 *
 * @private
 */
export class ComponentProvider {
  messagePaths = ['$.channels.*.*.message', '$.components.messages.*'];
  schemaPaths = [
    '$.channels.*.*.message.traits[*]..[?(@.type)]',
    '$.channels.*.*.message.headers',
    '$.channels.*.*.message.headers..[?(@.type)]',
    '$.channels.*.*.message.payload',
    '$.channels.*.*.message.payload..[?(@.type)]',
    '$.channels.*.parameters.*.schema[?(@.type)]',
    '$.channels.*.parameters.*.schema..[?(@.type)]',
    '$.components.schemas..[?(@.type)]',
  ];

  parameterPaths = ['$.channels.*.parameters.*', '$.components.parameters.*'];
  messages = new Map<string, Message>();
  schemas = new Map<string, Schema>();
  parameters = new Map<string, ChannelParameter>();

  constructor(private document: AsyncAPIDocument) {
    this.messages = this.parseComponents(this.messagePaths);
    this.schemas = this.parseComponents(this.schemaPaths);
    this.parameters = this.parseComponents(this.parameterPaths);
  }

  private toLodashPath(path: string) {
    return path.replace(/'\]\['/g, '.')
      .slice(3, -2)
      .replace(/'\]/g, '')
      .replace(/\['/g, '.');
  }
  private parseComponents(paths: string[]): any {
    return _.chain(paths)
      .map((messagePath) => {
        return JSONPath({
          path: messagePath,
          resultType: 'all',
          json: this.document.json(),
        });
      })
      .flatten()
      .reduce((red, message) => {
        return red.set(this.toLodashPath(message.path), message.value);
      }, new Map())
      .value();
  }
}
