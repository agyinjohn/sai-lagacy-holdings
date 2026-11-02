'use client';

import { useSyncExternalStore } from 'react';

/**
 * Cookie and analytics consent. Nothing but the visitor's own choice is stored, and that
 * choice is strictly necessary for the banner to behave. Analytics stays OFF until "granted".
 */
const KEY = 'cbs-consent-v1';
const listeners = new Set<() => void>();
let panelOpen = false;

type Choice = 'granted' | 'denied' | 'unset';

function readChoice(): Choice {
  try {
    const v = window.localStorage.getItem(KEY);
    return v === 'granted' || v === 'denied' ? v : 'unset';
  } catch {
    return 'unset';
  }
}

const emit = () => listeners.forEach((l) => l());

export function setConsent(choice: 'granted' | 'denied') {
  try {
    window.localStorage.setItem(KEY, choice);
  } catch {
    /* storage unavailable: the choice applies to this page view only */
  }
  panelOpen = false;
  emit();
}

export function openConsentPanel() {
  panelOpen = true;
  emit();
}

export function closeConsentPanel() {
  panelOpen = false;
  emit();
}

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  window.addEventListener('storage', cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener('storage', cb);
  };
};

// Snapshot is a primitive string so React can compare it cheaply.
const snapshot = () => `${readChoice()}|${panelOpen ? 1 : 0}`;
const serverSnapshot = () => 'server|0';

export function useConsent(): { choice: Choice | 'server'; panelOpen: boolean } {
  const [choice, open] = useSyncExternalStore(subscribe, snapshot, serverSnapshot).split('|');
  return { choice: choice as Choice | 'server', panelOpen: open === '1' };
}
