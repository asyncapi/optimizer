/**
 * Compares two components.
 * @remarks
 *
 * this function will return false if one of components is a ref of another in spec file.
 *
 * @param component1 - the first component that we are going to compare.
 * @param component2 - the second component that we are going to compare.
 * @returns true, if both components are identical; false, if the components are not identical or one is a reference of another in spec file.
 *
 * @beta @virtual
 */

const shallowEqual = (component1: any, component2: any): boolean => {
  try {
    const keys1 = Object.keys(component1);
    const keys2 = Object.keys(component2);

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (const key of keys1) {
      if (!key.startsWith('x-')) {
        const objectType = typeof component1[key] === 'object';
        if (objectType) {
          if (!shallowEqual(component1[key], component2[key])) {
            return true;
          }
        } else if (component1[key] !== component2[key]) {
          return false;
        }
      }
    }
  } catch (err) {
    return false;
  }
  return true;
};

const compareComponents = (component1: any, component2: any): boolean => {
  const schemaID = 'x-parser-schema-id';
  if (Object.prototype.hasOwnProperty.call(component1, 'x-parser-schema-id') && component1[schemaID] === component2[schemaID]) {
    return false;
  } 
  return shallowEqual(component1, component2);
};
export { compareComponents };
