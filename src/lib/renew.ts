import Greenlock from 'greenlock';
import acmeDnsCloudflare from 'acme-dns-01-cloudflare';

const pkg = require('./package.json');

export function renew({ subject, token, email, altnames }: { subject: string, token: string, email: string, altnames: string[] }) {
	const cloudflareDns01 = new acmeDnsCloudflare({
		token,
		verifyPropagation: true,
		verbose: true // log propagation delays and other debug information
	});

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
			"dns-01": cloudflareDns01
		}
	});

	greenlock.add({
		subject,
		altnames
	}).then(function () {
		return { ok: true };
	}).catch((error: any) => {
		return {
			ok: false,
			error
		}
	});
}