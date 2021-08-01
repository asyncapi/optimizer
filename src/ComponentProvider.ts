import type { Schema, Message, AsyncAPIDocument, ChannelParameter } from '@asyncapi/parser';

/**
 * This Singleton class will provide all sorts of data for optimizers.
 *
 * @public
 */
export class ComponentProvider {
  messages = new Map<string, Message>();
  schemas = new Map<string, Schema>();
  parameters = new Map<string, ChannelParameter>();

  constructor(private document: AsyncAPIDocument) {
    this.scanChannels();
    this.scanComponents();
  }

  private scanChannels = (): void => {
    const channels = this.document.channels();
    for (const channelName in channels) {
      const path = `channels.${channelName}`;
      const channel = this.document.channel(channelName);
      if (channel.hasPublish()) {
        const message = channel.publish().message();
        const currentPath = `${path}.publish.message`;
        this.scanMessage(currentPath, message);
        this.messages.set(currentPath,message);
      }
      if (channel.hasSubscribe()) {
        const message = channel.subscribe().message();
        const currentPath = `${path}.subscribe.message`;
        this.scanMessage(currentPath, message);
        this.messages.set(currentPath,message);
      }
      if (channel.hasParameters()) {
        const currentPath = `${path}.parameters`;
        for (const [name,channelParameter] of Object.entries(channel.parameters())) {
          this.parameters.set(`${currentPath}.${name}`, channelParameter);
        }
      }
    }
  }
  private scanHeader = (path: string, headers: any): void => {
    this.schemas.set(path,headers);
    const headersProperties = headers.properties;
    for (const [propertyName, propertySchema] of Object.entries(headersProperties)) {
      this.schemas.set(`${path}.properties.${propertyName}`, propertySchema as Schema);
    }
  }
  private scanMessage = (path: string, message: Message): void => {
    const payload = message.payload();
    if (payload) {
      this.schemas.set(`${path}.payload`,payload);
      const payloadProperties = payload.properties();
      for (const [propertyName, propertySchema] of Object.entries(payloadProperties)) {
        this.schemas.set(`${path}.payload.properties.${propertyName}`, propertySchema);
      }
    }
    
    //scanning the traits.
    const traits = message.extension('x-parser-original-traits');
    for (let i = 0; i < traits.length; i++) {
      if (Object.keys(traits[i]).includes('headers')) {this.scanHeader(`${path}.traits[${i}].headers`, message.headers());}
    }
  }
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
