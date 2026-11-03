'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function TeamLogin() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/team/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.get('username'), password: form.get('password') }),
      });
      if (res.ok) {
        router.refresh();
        return;
      }
      if (res.status === 429) setError('Too many attempts. Please wait a while before trying again.');
      else if (res.status === 503) setError('The team area is not configured on this server.');
      else setError('That username and password were not recognised.');
    } catch {
      setError('Could not reach the server. Please try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md rounded-[2px] border border-pale bg-white p-6 sm:p-8" aria-label="Team sign in">
      {error && (
        <p role="alert" className="mb-5 rounded-[2px] border-2 border-error bg-[#fdf2f2] p-3 text-error">
          {error}
        </p>
      )}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="team-user" className="font-medium">
          Username
        </label>
        <input id="team-user" name="username" type="text" autoComplete="username" required className="min-h-[48px] rounded-[2px] border border-deep px-3" />
      </div>
      <div className="mt-5 flex flex-col gap-1.5">
        <label htmlFor="team-pass" className="font-medium">
          Password
        </label>
        <input id="team-pass" name="password" type="password" autoComplete="current-password" required className="min-h-[48px] rounded-[2px] border border-deep px-3" />
      </div>
      <button
        type="submit"
        disabled={busy}
        className="mt-6 inline-flex min-h-[52px] items-center justify-center rounded-[2px] border border-deep bg-deep px-7 font-medium text-white hover:bg-mid disabled:opacity-70"
      >
        {busy ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
