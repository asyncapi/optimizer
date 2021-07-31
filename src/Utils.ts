
import * as _ from 'lodash';
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
const backwardsCheck = (x: any, y: any): boolean => {
  for (const p in y) {
    if (_.has(y, p) && !_.has(x, p)) {return false;}
  }
  return true;
};
const compareComponents = (x: any, y: any): boolean => {
  if (!(x instanceof Object) || !(y instanceof Object)) {return false;}
  // if they are not strictly equal, they both need to be Objects
  for (const p in x) {
    if (!_.has(x, p)) {continue;}

    if (!_.has(y, p)) {return false;}
    // allows to compare x[ p ] and y[ p ] when set to undefined

    if (x[String(p)] === y[String(p)] || p.startsWith('x-')) {continue;}
    // if they have the same strict value or identity then they are equal

    if (typeof (x[String(p)]) !== 'object') {return false;}
    // Numbers, Strings, Functions, Booleans must be strictly equal

    if (!compareComponents(x[String(p)], y[String(p)])) {return false;}
    // Objects and Arrays must be tested recursively
  }
  return backwardsCheck(x,y);
};
export { compareComponents };
