import { AStepper, OK, TNamed, TWorld, IHasOptions } from '@haibun/core/build/lib/defs';
import { actionNotOK, stringOrError } from '@haibun/core/build/lib/util';
import acmeDnsCloudflare from 'acme-dns-01-cloudflare';
import { renew } from './lib/renew';

const SUBJECT = 'subject';
const TOKEN = 'token';
const EMAIL = 'email';
const ALTNAMES = 'altnames';

class httpsStepper extends AStepper implements IHasOptions {
  options = {
    [SUBJECT]: {
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

  async renewSubject(subject: string) {
    const { options } = this.getWorld();
    const service = new acmeDnsCloudflare({
      token: options.TOKEN,
      verifyPropagation: true,
      verbose: true
    });

    const args: any = ['TOKEN', 'EMAIL', 'ALTNAMES'].reduce((a, o) => {
      return { ...a, [o.toLowerCase()]: this.getWorld().options[o] };
    }, {});
    const value = await renew({ ...args, service, subject });
    if (value.ok === true) {
      return OK;
    }
    return actionNotOK(`renewal failed for ${subject}`, { topics: { https: { summary: value.error.message!, details: value.error } } });
  }
  steps = {
    renewCertificate: {
      gwta: `renew the certificate`,
      action: async ({ subject }: TNamed) => {
        const oSubject = this.getWorld().options.SUBJECT;
        if (!oSubject) {
          return actionNotOK('missing subject');
        }
        return await this.renewSubject(oSubject);
      }
    },
    renewCertificateFor: {
      gwta: `renew the certificate for {subject}`,
      action: async ({ subject }: TNamed) => {
        return await this.renewSubject(subject);
      }
    }
  }
}

export default httpsStepper;
