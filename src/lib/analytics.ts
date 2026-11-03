/**
 * Analytics placeholder. NOTHING loads here until:
 *   1. the visitor has clicked "Accept analytics", AND
 *   2. NEXT_PUBLIC_ANALYTICS_PROVIDER is set, AND
 *   3. a provider has been wired in below and approved (add its domains to the CSP in next.config.ts).
 * No paid service or account is assumed.
 */
export function startAnalytics(): void {
  const provider = process.env.NEXT_PUBLIC_ANALYTICS_PROVIDER;
  if (!provider) return;
  switch (provider) {
    // case 'plausible': inject the provider script here
    default:
      console.debug(`[analytics placeholder] provider "${provider}" is not implemented. Nothing was loaded.`);
  }
}
