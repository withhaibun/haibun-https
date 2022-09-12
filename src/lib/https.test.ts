import https from './https';

describe('test https lib ', () => {
    it('passes', async () => {
        expect((await https('github.com')).ok).toBe(true);
    });
    it('fails', async () => {
        expect((await https('github.comils'))?.ok!).toBe(false);
    });
})
