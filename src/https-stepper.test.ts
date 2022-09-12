import { testWithDefaults } from '@haibun/core/build/lib/test/lib';

import https from './https-stepper';

describe('https test', () => {
  it('is valid', async () => {
    const feature = { path: '/features/test.feature', content: `certificate for github.com is valid` };
    const result = await testWithDefaults([feature], [https]);
    expect(result.ok).toBe(true);
  });
  it('is not valid', async () => {
    const feature = { path: '/features/test.feature', content: `certificate for example.comx is valid` };
    const result = await testWithDefaults([feature], [https]);
    expect(result.ok).toBe(false);
  });
  it('is valid for days', async () => {
    const feature = { path: '/features/test.feature', content: `certificate for github.com is valid for more than 1 days` };
    const result = await testWithDefaults([feature], [https]);
    expect(result.ok).toBe(false);
  });
  it('is valid for enough days', async () => {
    const feature = { path: '/features/test.feature', content: `certificate for github.com is valid for more than 999999 days` };
    const result = await testWithDefaults([feature], [https]);
    expect(result.ok).toBe(false);
  });
});
