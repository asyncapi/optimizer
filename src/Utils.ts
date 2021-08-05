
import * as _ from 'lodash';

const isExtension = (fieldName: string): boolean => {
  return fieldName.startsWith('x-');
};
const backwardsCheck = (x: any, y: any): boolean => {
  for (const p in y) {
    if (_.has(y, p) && !_.has(x, p)) {return false;}
  }
  return true;
};

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
  // if they are not strictly equal, they both need to be Objects
  if (!(x instanceof Object) || !(y instanceof Object)) {return false;}
  for (const p in x) {
    //extensions have different values for objects that are equal (duplicated.) If you don't skip the extensions this function always returns false.
    if (isExtension(p)) {continue;}
    if (!_.has(x, p)) {continue;}
    
    // allows to compare x[ p ] and y[ p ] when set to undefined
    if (!_.has(y, p)) {return false;}

    // if they have the same strict value or identity then they are equal
    if (x[String(p)] === y[String(p)]) {continue;}

    // Numbers, Strings, Functions, Booleans must be strictly equal
    if (typeof (x[String(p)]) !== 'object') {return false;}

    // Objects and Arrays must be tested recursively
    if (!compareComponents(x[String(p)], y[String(p)])) {return false;}
  }
  return backwardsCheck(x, y);
};
const isEqual = (component1: any, component2: any, referentialEqualityCheck: boolean): boolean => {
  if (referentialEqualityCheck) {
    return component1.json() === component2.json() || compareComponents(component1.json(), component2.json());
  }
  return component1.json() !== component2.json() && compareComponents(component1.json(), component2.json());
};

const isInComponents = (path: string): boolean => {
  return path.startsWith('components.');
};
const isInChannels = (path: string): boolean => {
  return path.startsWith('channels.');
};
export { compareComponents, isEqual, isInComponents, isInChannels };
