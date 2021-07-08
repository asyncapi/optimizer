
/**
 * Compares two components.
 * @remarks
 *
 * this recursive function is responsible for comparing two component.
 *
 * @param x - the first component that we are going to compare.
 * @param y - the second component that we are going to compare.
 * @returns true, if both components are identical; false, if the components are not identical.
 *
 */
const compareComponents = (x: any, y: any): boolean => {
  if (!(x instanceof Object) || !(y instanceof Object)) {return false;}
  // if they are not strictly equal, they both need to be Objects
  for (const p in x) {
    if (!Object.prototype.hasOwnProperty.call(x, p)) {continue;}

    if (!Object.prototype.hasOwnProperty.call(y, p)) {return false;}
    // allows to compare x[ p ] and y[ p ] when set to undefined

    if (x[String(p)] === y[String(p)] || p.startsWith('x-')) {continue;}
    // if they have the same strict value or identity then they are equal

    if (typeof (x[String(p)]) !== 'object') {return false;}
    // Numbers, Strings, Functions, Booleans must be strictly equal

    if (!compareComponents(x[String(p)], y[String(p)])) {return false;}
    // Objects and Arrays must be tested recursively
  }

  for (const p in y) {
    if (Object.prototype.hasOwnProperty.call(y, p) && !Object.prototype.hasOwnProperty.call(x, p)) {return false;}
  }
  // allows x[ p ] to be set to undefined

  return true;
};

export { compareComponents };
