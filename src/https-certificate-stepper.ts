import { AStepper, OK, TNamed } from '@haibun/core/build/lib/defs/index.js';
import { actionNotOK } from '@haibun/core/build/lib/util/index.js';

import https from './lib/https.js';

class httpsStepper extends AStepper {
	steps = {
		certificateIsValidMoreThan: {
			gwta: `certificate for {domain} is valid for more than {howmany} days`,
			action: async ({ domain, howmany }: TNamed) => {
				const value = await https(domain!);
				if (value.ok === true) {
					if (value.result?.daysRemaining! > parseInt(howmany!)) {
						return OK;
					}
				}
				return actionNotOK(value.message!, { topics: { https: { summary: value.message!, details: value.result } } });
			},
		},
		certificateIsValid: {
			gwta: `certificate for {domain} is valid`,
			action: async ({ domain }: TNamed) => {
				const value = await https(domain!);
				if (value.ok === true) {
					return OK;
				}
				return actionNotOK(value.message!, { topics: { https: { summary: value.message!, details: value.result } } });
			},
		},
	};
}

export default httpsStepper;