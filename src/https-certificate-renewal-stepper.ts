import { AStepper, OK, TNamed, TWorld, IHasOptions } from '@haibun/core/build/lib/defs';
import { actionNotOK, stringOrError } from '@haibun/core/build/lib/util';
import { renew, TRenewOptions } from './lib/renew';

const CHALLENGE = 'challenge';
const SERVICE = 'service';
const SUBJECT = 'subject';
const TOKEN = 'token';
const EMAIL = 'email';
const ALTNAMES = 'altnames';

class httpsStepper extends AStepper implements IHasOptions {
  options = {
    [CHALLENGE]: {
      required: true,
      desc: 'Challenge type (dns-01, http-01, tls-alpn-01)',
      parse: (input: string) => stringOrError(input),
    },
    [SERVICE]: {
      required: true,
      desc: 'Challenge service',
      parse: (input: string) => stringOrError(input),
    },
    [SUBJECT]: {
      required: true,
      desc: 'Domain to renew',
      parse: (input: string) => stringOrError(input),
    },
    [ALTNAMES]: {
      required: true,
      desc: 'Alternate subject names',
      parse: (input: string) => {
        if (!input) {
          return stringOrError(input)
        }
        return {
          result: input.split(',').map(i => i.trim())
        }
      }
    },
    [TOKEN]: {
      desc: 'Token for services that use a token',
      parse: (input: string) => stringOrError(input),
    },
    [EMAIL]: {
      required: true,
      desc: 'Associated email address',
      parse: (input: string) => stringOrError(input),
    },
  };
  setWorld(world: TWorld, steppers: AStepper[]) {
    super.setWorld(world, steppers);
  }

  steps = {
    renewCertificate: {
      gwta: `renew the certificate for {domain}`,
      action: async ({ domain }: TNamed) => {
        const options: any = ['CHALLENGE', 'SERVICE', 'TOKEN', 'EMAIL', 'ALTNAMES'].reduce((a, o) => {
          return { ...a, [o.toLowerCase()]: this.getWorld().options[o] };
        }, {});
        const value = await renew(options);
        if (value.ok === true) {
          return OK;
        }
        return actionNotOK(value.error.message!, { topics: { https: { summary: value.error.message!, details: value.error } } });
      }
    }
  }
}

export default httpsStepper;
