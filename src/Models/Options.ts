export enum Output {
  JSON = 'JSON',
  YAML = 'YAML'
}
interface Rules {
  reuseComponents?: boolean;
  removeComponents?: boolean;
  moveToComponents?: boolean;
}
export interface Options {
  rules?: Rules;
  output?: Output;
}
