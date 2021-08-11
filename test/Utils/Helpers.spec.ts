import { compareComponents, isEqual, isInComponents, isInChannels } from '../../src/Utils';

describe('Helpers', () => {
  const testObject1 = { json: jest.fn().mockReturnValueOnce({ streetlightId: { schema: { type: 'string', 'x-extension': 'different_value' } } }) };
  const testObject1_copy = { json: jest.fn().mockReturnValueOnce({ streetlightId: { schema: { type: 'string', 'x-extension': 'value' } } })};
  const testObject2 = { json: jest.fn().mockReturnValueOnce({ streetlightId: { schema: { type: 'number' } } }) };
  const testObject2_reference = testObject2;

  describe('compareComponents', () => {
    test('should return true.', () => {
      expect(compareComponents(testObject1.json(), testObject1_copy.json())).toEqual(true);
    });

    test('should return false.', () => {
      expect(compareComponents(testObject1.json(), testObject2.json())).toEqual(false);
    });
  });
  describe('isEqual', () => {
    test('should return true.', () => {
      expect(isEqual(testObject2, testObject2_reference, true)).toEqual(true);
      expect(isEqual(testObject1, testObject1_copy, true)).toEqual(true);
    });

    test('should return false.', () => {
      expect(isEqual(testObject1, testObject1_copy, false)).toEqual(false);
      expect(isEqual(testObject2, testObject2_reference, false)).toEqual(false);
    });
  });

  describe('isInComponents', () => {
    test('should return true.', () => {
      expect(isInComponents('components.messages.message1')).toEqual(true);
    });

    test('should return false.', () => {
      expect(isInComponents('channels.channel1.message')).toEqual(false);
    });
  });

  describe('isInChannels', () => {
    test('should return true.', () => {
      expect(isInChannels('channels.channel1.message')).toEqual(true);
    });

    test('should return false.', () => {
      expect(isInChannels('components.messages.message1')).toEqual(false);
    });
  });
});
