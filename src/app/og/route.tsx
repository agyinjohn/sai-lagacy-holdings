import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';

/** Share image for any page: /og?title=... . The title is length-capped and rendered as plain text. */
export function GET(request: Request) {
  const raw = new URL(request.url).searchParams.get('title') ?? 'The Courtyard by Sai';
  const title = raw.replace(/[\u0000-\u001f]/g, ' ').slice(0, 90);
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', padding: 72, background: 'linear-gradient(180deg,#0E2E21 0%,#123B2A 50%,#3B6A53 100%)', color: 'white', position: 'relative' }}>
        <div style={{ fontSize: 24, letterSpacing: 4, color: '#D9B267', textTransform: 'uppercase' }}>The Courtyard by Sai</div>
        <div style={{ fontSize: title.length > 48 ? 62 : 80, marginTop: 28, lineHeight: 1.06, maxWidth: 940 }}>{title}</div>
        <div style={{ fontSize: 28, marginTop: 'auto', color: '#B7CBBB' }}>Rooted on the Ridge. A proposed destination in Akuapem.</div>
        <svg width="1200" height="200" viewBox="0 0 1440 240" style={{ position: 'absolute', left: 0, bottom: 0, opacity: 0.8 }}>
          <path d="M0 90 C180 50 300 80 460 40 C620 0 760 60 930 30 C1100 0 1260 40 1440 10 L1440 240 L0 240Z" fill="#7CA088" fillOpacity="0.5" />
          <path d="M0 160 C220 120 380 170 600 130 C800 95 980 160 1180 125 C1290 105 1370 115 1440 100 L1440 240 L0 240Z" fill="#3B6A53" />
          <path d="M0 215 C240 175 460 225 720 190 C960 160 1180 220 1440 175 L1440 240 L0 240Z" fill="#123B2A" />
        </svg>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
