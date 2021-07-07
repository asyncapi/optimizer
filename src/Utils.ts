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
const compareComponents = (component1: any, component2: any): boolean => {
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
          if (!compareComponents(component1[String(key)], component2[String(key)])) {
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
export { compareComponents };
