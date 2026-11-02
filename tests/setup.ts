import { beforeEach } from 'vitest';
import { resetStoreForTests } from '@/lib/storage';
import { limiters } from '@/lib/rate-limit';

process.env.STORAGE_DRIVER = 'memory';
process.env.EMAIL_DRIVER = 'console';
process.env.TEAM_USERNAME = 'team-demo';
process.env.TEAM_PASSWORD = 'correct-horse-battery';
process.env.TEAM_SESSION_SECRET = 'x'.repeat(48);
process.env.RATE_LIMIT_MAX = '5';
process.env.RATE_LIMIT_WINDOW_SECONDS = '600';

beforeEach(() => {
  resetStoreForTests();
  const l = limiters();
  l.submit.reset();
  l.attempts.reset();
  l.login.reset();
});
