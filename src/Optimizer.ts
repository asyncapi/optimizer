import { Report } from './Models/Report';
import { AsyncAPIDocument } from '@asyncapi/parser';
import { RemoveComponents } from './Optimizers/RemoveComponents';
import { MoveToComponents } from './Optimizers/MoveToComponents';
import { ReuseComponents } from './Optimizers/ReuseComponents';

/**
 * this class is the starting point of the library.
 * user will only interact with this class. here we generate different kind of reports using optimizers, apply changes and return the results to the user.
 *
 * @public
 */
export class Optimizer {
  constructor(private document: AsyncAPIDocument) {}

  /**
   * @returns a {@link Report} object containing all of the optimizations that the library can do.
   * @public
   */
  getReport = (): Report => {
    const reuseComponents = new ReuseComponents(this.document);
    const removeComponents = new RemoveComponents(this.document);
    const moveToComponents = new MoveToComponents(this.document);

    return {
      reuseComponents: reuseComponents.getReport(),
      removeComponents: removeComponents.getReport(),
      moveToComponents: moveToComponents.getReport()
    };
  }
}
