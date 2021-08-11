import type { AsyncAPIDocument, ChannelParameter, Message, Schema } from '@asyncapi/parser';
import { compareComponents } from './Utils';
import { ComponentStatus } from './Models';

/**
 * This class will provide all sorts of data for optimizers.
 *
 * @private
 */
export class ComponentProvider {
  messages = new Map<string, Message>();
  schemas = new Map<string, Schema>();
  parameters = new Map<string, ChannelParameter>();

  constructor(private document: AsyncAPIDocument) {
    this.scanChannels();
    this.scanComponents();
  }

  /**
   * This function is responsible for scanning the document's channels section.
   *
   * @returns {void}
   */
  private scanChannels = (): void => {
    const channels = this.document.channels();
    for (const channelName in channels) {
      const path = `channels.${channelName}`;
      const channel = this.document.channel(channelName);

      if (channel.hasPublish()) {
        const message = channel.publish().message();
        const currentPath = `${path}.publish.message`;
        this.scanMessage(currentPath, message);
        this.messages.set(currentPath, message);
      }

      if (channel.hasSubscribe()) {
        const message = channel.subscribe().message();
        const currentPath = `${path}.subscribe.message`;
        this.scanMessage(currentPath, message);
        this.messages.set(currentPath, message);
      }

      if (channel.hasParameters()) {
        const currentPath = `${path}.parameters`;
        for (const [name, channelParameter] of Object.entries(channel.parameters())) {
          this.parameters.set(`${currentPath}.${name}`, channelParameter);
        }
      }
    }
  }
  /**
   * This function is responsible for scanning any schema that is passed to it.
   *
   * @param {string} path - path of the schema that needs to be scanned.
   * @param {Schema} schema - the actual schema object.
   *
   * @returns {void}
   */
  private scanSchema = (path: string, schema: Schema): void => {
    this.schemas.set(path, schema);
    const schemaProperties = schema.properties();
    for (const [propertyName, propertySchema] of Object.entries(schemaProperties)) {
      this.schemas.set(`${path}.properties.${propertyName}`, propertySchema);
    }
  }

  /**
   * This function will determine if a component is in its respective traits or not.
   *
   * @param {string} type - A string to pass the name of the child component. it should
   * be the field name that is passed in childComponent field.
   * @param {any} childComponent - this is the child component that needs to be checked.
   * @param {any} parent - this is the childComponent's parent. it should contain traits filed.
   * @returns {ComponentStatus} Returns the location of the component.
   *
   * @example
   *
   *     isInTraits('payload', payload, message)
   */
  private isInTraits = (type: string, childComponent: any, parent: any): ComponentStatus => {
    const traits = parent.extension('x-parser-original-traits');
    if (Array.isArray(traits)) {
      for (const trait of traits) {
        for (const key in trait) {
          if (key === type) {
            if (compareComponents(childComponent.json(), trait[String(key)])) {
              return ComponentStatus.InTrait;
            }
            return ComponentStatus.Mixed;
          }
        }
      }
    }
    return ComponentStatus.InField;
  }

  /**
   * This function will scan a component by name from traits of another component.
   *
   * @param {string} name - the name of the component that needs to be extracted from traits.
   * @param {any} child - the child that needs to be scanned.
   * @param {any} parent - this is the parent. it should contain traits to be scanned.
   * @param {string} path - path of the parent.
   * @returns {void}
   *
   * @example
   *
   *     scanInTrait('payload', payload, message, path)
   */
  private scanInTrait = (name: string, child: any, parent: any, path: string): void => {
    const traits = parent.extension('x-parser-original-traits');
    for (let i = 0; i < traits.length; i++) {
      // eslint-disable-next-line security/detect-object-injection
      for (const key in traits[i]) {
        if (key === name) {
          this.scanSchema(`${path}.traits[${i}].${name}`, child);
        }
      }
    }
  }

  /**
   * This function will handle the cases which it is possible that the values of a
   * field is coming from a trait.
   *
   * @param {string} name - the name of the component that needs to be extracted from traits.
   * @param {string} parentPath - path of the parent.
   * @param {any} child - the child that needs to be scanned.
   * @param {any} parent - this is the parent. it should contain traits to be scanned.
   * @returns {void}
   *
   * @example
   *
   *     handlePossibleInTraitsComponents('payload', path, payload, message)
   */
  private handlePossibleInTraitsComponents = (name: string, parentPath: string, child: any, parent: any) => {
    switch (this.isInTraits(name, child, parent)) {
    case ComponentStatus.InTrait:
      this.scanInTrait(name, child, parent, parentPath);
      break;
    case ComponentStatus.InField:
      this.scanSchema(`${parentPath}.${name}`, child);
      break;
    case ComponentStatus.Mixed:
      // When we have mixed components that has fields in both traits and
      // in component itself. we ignore this case for now.
      break;
    }
  }
  /**
   * This function is responsible for scanning any message that is passed to it.
   *
   * @param {string} path - path of the message that needs to be scanned.
   * @param {Message} message - the actual message object.
   *
   * @returns {void}
   */
  private scanMessage = (path: string, message: Message): void => {
    const payload = message.payload();
    const headers = message.headers();
    if (payload) {
      this.handlePossibleInTraitsComponents('payload', path, payload, message);
    }
    
    if (headers) {
      this.handlePossibleInTraitsComponents('headers', path, headers, message);
    }
  }
  /**
   * This function is responsible for scanning the document's components section.
   *
   * @returns {void}
   */
  private scanComponents = (): void => {
    const components = this.document.components();
    if (!components) {
      return;
    }

    if (components.hasMessages()) {
      for (const [messageName, message] of Object.entries(components.messages())) {
        this.messages.set(`components.messages.${messageName}`, message);
      }
    }

    if (components.hasSchemas()) {
      for (const [schemaName, schema] of Object.entries(components.schemas())) {
        this.schemas.set(`components.schemas.${schemaName}`, schema);
      }
    }

    if (components.hasParameters()) {
      for (const [parameterName, parameter] of Object.entries(components.parameters())) {
        this.parameters.set(`components.parameters.${parameterName}`, parameter);
      }
    }
  }
}
