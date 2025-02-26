import  sslChecker  from "ssl-checker";

export default async function https(hostname: string): Promise<any> {
  try {
    const result = await (sslChecker as any)(hostname);
    return result.valid ? { ok: true, result } : { ok: false, message: 'not valid', result }
  } catch (error: any) {
    return { ok: false, message: error.message, error }
  }
}