import { AStepper, OK, TNamed, TWorld } from '@haibun/core/build/lib/defs';
import { actionNotOK } from '@haibun/core/build/lib/util';

import https from './lib/https';

class httpsStepper extends AStepper {
  setWorld(world: TWorld, steppers: AStepper[]) {
    super.setWorld(world, steppers);
  }

  steps = {
    certificateIsValidMoreThan: {
      gwta: `certificate for {domain} is valid for more than {howmany} days`,
      action: async ({ domain, howmany }: TNamed) => {
        const value = await https(domain);
        if (value.ok === true) {
          if (value.result?.daysRemaining! > parseInt(howmany)) {
            return OK;
          }
        }
        return actionNotOK(value.message!, { topics: { https: { summary: value.message!, details: value.result } } });
      }
    },
    certificateIsValid: {
      gwta: `certificate for {domain} is valid`,
      action: async ({ domain }: TNamed) => {
        const value = await https(domain);
        if (value.ok === true) {
          return OK;
        }
        return actionNotOK(value.message!, { topics: { https: { summary: value.message!, details: value.result } } });
      }
    },
  }
}

export default httpsStepper;
