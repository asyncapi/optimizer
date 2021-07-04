/**
 * Compares two components.
 * @remarks
 *
 * this recursive function is responsible for comparing two component.
 *
 * @param component1 - the first component that we are going to compare.
 * @param component2 - the second component that we are going to compare.
 * @returns true, if both components are identical; false, if the components are not identical.
 *
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
        const objectType = typeof component1[String(key)] === 'object';
        if (objectType) {
          if (!shallowEqual(component1[String(key)], component2[String(key)])) {
            return true;
          }
        } else if (component1[String(key)] !== component2[String(key)]) {
          return false;
        }
      }
    }
  } catch (err) {
    return false;
  }
  return true;
};
/**
 * if one component is a $ref of another, it will return false. otherwise it will pass the comparing task to {@link shallowEqual}
 *
 * @param component1 - the first component that we are going to compare.
 * @param component2 - the second component that we are going to compare.
 * @returns true, if both components are identical; false, if the components are not identical or one is a reference of another in spec file.
 *
 */
const compareComponents = (component1: any, component2: any): boolean => {
  //if one component is a $ref on another.
  if (component1 === component2) {
    return false;
  }
  return shallowEqual(component1, component2);
};
export { compareComponents };
