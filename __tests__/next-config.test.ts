/**
 * Values in the `env` block of next.config.js are inlined into the client
 * JavaScript at build time, so a token or secret listed there can end up in
 * the browser bundle. Server code must read secrets from process.env at
 * runtime instead. This test fails if a secret-like name is added back.
 */
const nextConfig = require('../next.config.js');

describe('next.config.js env', () => {
  it('passes no token, secret, password or key to the client bundle', () => {
    const leaked = Object.keys(nextConfig.env ?? {}).filter((name) =>
      /TOKEN|SECRET|PASSWORD|PRIVATE|API_KEY/i.test(name)
    );
    expect(leaked).toEqual([]);
  });
});
