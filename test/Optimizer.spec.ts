import { asyncapiYAML } from './inputs';
import { Optimizer } from '../src';

const output = `asyncapi: 2.0.0
info:
  title: Streetlights API
  version: 1.0.0
channels:
  "smartylighting/event/{streetlightId}/lighting/measured":
    parameters:
      streetlightId:
        $ref: "#/components/parameters/parameter-1"
    subscribe:
      operationId: receiveLightMeasurement
      traits:
        - bindings:
            kafka:
              clientId: my-app-id
      message:
        name: lightMeasured
        title: Light measured
        contentType: application/json
        traits:
          - headers:
              $ref: "#/components/schemas/schema-1"
        payload:
          type: object
          properties:
            lumens:
              type: integer
              minimum: 0
            sentAt:
              $ref: "#/components/schemas/sentAt"
  "smartylighting/action/{streetlightId}/turn/on":
    parameters:
      streetlightId:
        $ref: "#/components/parameters/parameter-1"
    publish:
      operationId: turnOn
      traits:
        - bindings:
            kafka:
              clientId: my-app-id
      message:
        name: turnOnOff
        title: Turn on/off
        traits:
          - headers:
              $ref: "#/components/schemas/schema-1"
        payload:
          type: object
          properties:
            sentAt:
              $ref: "#/components/schemas/sentAt"
components:
  schemas:
    sentAt:
      type: string
      format: date-time
    schema-2:
      type: integer
      minimum: 0
      maximum: 100
    schema-1:
      type: object
      properties:
        my-app-header:
          $ref: "#/components/schemas/schema-2"
  parameters:
    parameter-1:
      schema:
        type: string`;

describe('Optimizer', () => {
  let optimizer: Optimizer;
  beforeAll(async () => {
    optimizer = new Optimizer(asyncapiYAML);
    await optimizer.getReport();
  });
  test('should produce the correct optimized file.', () => {
    expect(optimizer.getOptimizedDocument({ rules: {
      reuseComponents: true,
      removeComponents: true,
      moveToComponents: true
    } }).trim()).toEqual(output.trim());
  });
});
