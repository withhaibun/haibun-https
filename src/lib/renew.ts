import Greenlock from 'greenlock';
export type TRenewOptions = { subject: string, token: string, email: string, altnames: string[], service: any, type: string };
const pkg = require('./package.json');

export async function renew({ subject, token, email, altnames, type, service }: TRenewOptions) {
	const greenlock = Greenlock.create({
		packageAgent: pkg.name + '/' + pkg.version,
		configDir: "./store",
		maintainerEmail: email,
		packageRoot: '.'
	});

	greenlock.manager.defaults({
		agreeToTerms: true,
		subscriberEmail: email,
		store: {
			module: "greenlock-store-fs",
			basePath: "./store/certs"
		},
		challenges: {
			[type]: service
		}
	});

	try {
		await greenlock.add({
			subject,
			altnames
		});
		return { ok: true };
	} catch (error: any) {
		return {
			ok: false,
			error
		}
	}
}