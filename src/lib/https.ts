import sslChecker from "ssl-checker";

export default async function https(hostname: string) {
  try {
    const result = await sslChecker(hostname);
    return result.valid ? { ok: true, result } : { ok: false, message: 'not valid', result }
  } catch (error: any) {
    return { ok: false, message: error.message, error }
  }
}