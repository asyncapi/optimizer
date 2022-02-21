import type { AsyncAPIDocument, ChannelParameter, Message, MessageTrait, Schema } from '@asyncapi/parser';

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

  private scanChannels(): void {
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

  private scanSchema(path: string, schema: Schema): void {
    if (!schema) {return;}
    this.schemas.set(path, schema);
    const schemaProperties = schema.properties();
    for (const [propertyName, propertySchema] of Object.entries(schemaProperties)) {
      this.schemas.set(`${path}.properties.${propertyName}`, propertySchema);
    }
  }

  private scanMessageTraits(path: string, traits: MessageTrait[]): void {
    for (const [index, trait] of Object.entries(traits)) {
      if (trait.headers()) {
        this.scanSchema(`${path}[${index}].headers`, trait.headers());
      }
    }
  }

  private scanMessage(path: string, message: Message): void {
    this.scanSchema(`${path}.payload`, message.payload());
    this.scanSchema(`${path}.headers`, message.headers());
    this.scanMessageTraits(`${path}.traits`, message.traits());
  }

  private scanComponents(): void {
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
