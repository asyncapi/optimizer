
import * as _ from 'lodash';
import YAML from 'yaml';
/**
 * Checks if the field is an extention by checking its name.
 *
 * @private
 * @param {string} fieldName - the name of the field.
 * @returns {boolean } true, if the field is an extension.
 *
 */
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
 * this recursive function is responsible for comparing two component.
 *
 * @private
 * @param {any} x - the first component that we are going to compare.
 * @param {any} y - the second component that we are going to compare.
 * @returns {boolean } true, if both components are identical; false, if the components are not identical.
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
/**
 * Compares two components but also considers equality check. the referential equality check can be disabled by referentialEqualityCheck argument.
 *
 * @private
 * @param {any} component1 - the first component that we are going to compare.
 * @param {any} component2 - the second component that we are going to compare.
 * @param {boolean} referentialEqualityCheck - this argument controls whether the referential equality should be checked or not.
 * @returns {boolean } true, if both components are equal; false, if the components are not equal.
 *
 */
const isEqual = (component1: any, component2: any, referentialEqualityCheck: boolean): boolean => {
  if (referentialEqualityCheck) {
    return component1.json() === component2.json() || compareComponents(component1.json(), component2.json());
  }
  return component1.json() !== component2.json() && compareComponents(component1.json(), component2.json());
};

/**
 * Checks if the component is located in `components` section of the file by its path.
 *
 * @private
 * @param {string} path - the path of the component.
 * @returns {boolean } true, if the component is located in `components` section of the file.
 *
 */
const isInComponents = (path: string): boolean => {
  return path.startsWith('components.');
};
/**
 * Checks if the component is located in `channels` section of the file by its path.
 *
 * @private
 * @param {string} path - the path of the component.
 * @returns {boolean } true, if the component is located in `channels` section of the file.
 *
 */
const isInChannels = (path: string): boolean => {
  return path.startsWith('channels.');
};
const toJS = (asyncapiYAMLorJSON: any): any => {
  if (asyncapiYAMLorJSON.constructor && asyncapiYAMLorJSON.constructor.name === 'Object') {
    return JSON.parse(JSON.stringify(asyncapiYAMLorJSON));
  } 
  if (typeof asyncapiYAMLorJSON === 'string') {
    if (asyncapiYAMLorJSON.trimLeft().startsWith('{')) {
      return JSON.parse(asyncapiYAMLorJSON);
    } 
    return YAML.parse(asyncapiYAMLorJSON);
  }
};
export { compareComponents, isEqual, isInComponents, isInChannels, toJS };
