import { ImageResponse } from 'next/og';

export const alt = 'The Courtyard by Sai: Ghana’s next cultural and wellness destination';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', padding: 72, background: 'linear-gradient(180deg,#0E2E21 0%,#123B2A 45%,#3B6A53 100%)', color: 'white', position: 'relative' }}>
        <div style={{ fontSize: 26, letterSpacing: 4, color: '#D9B267', textTransform: 'uppercase' }}>Rooted on the Ridge</div>
        <div style={{ fontSize: 76, marginTop: 24, lineHeight: 1.05, maxWidth: 900 }}>Ghana’s next cultural and wellness destination</div>
        <div style={{ fontSize: 30, marginTop: 28, color: '#B7CBBB' }}>The Courtyard by Sai · A proposed destination in Akuapem</div>
        <svg width="1200" height="220" viewBox="0 0 1440 270" style={{ position: 'absolute', left: 0, bottom: 0 }}>
          <path d="M0 100 C180 60 300 90 460 50 C620 10 760 70 930 40 C1100 10 1260 50 1440 20 L1440 270 L0 270Z" fill="#7CA088" />
          <path d="M0 170 C220 130 380 180 600 140 C800 105 980 170 1180 135 C1290 115 1370 125 1440 110 L1440 270 L0 270Z" fill="#3B6A53" />
          <path d="M0 230 C240 190 460 240 720 205 C960 175 1180 235 1440 190 L1440 270 L0 270Z" fill="#123B2A" />
        </svg>
      </div>
    ),
    size,
  );
}
