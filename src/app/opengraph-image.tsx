import { ImageResponse } from 'next/og';
import { site } from '@/data/site';

export const dynamic = 'force-static';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = `${site.name} — ${site.role}`;

/** Prerendered to a static PNG at build time. This is what unfurls in Slack. */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0A0E1A',
          padding: '72px 80px',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 112,
              fontWeight: 800,
              color: '#F2F4F8',
              letterSpacing: '-0.03em',
              lineHeight: 1,
            }}
          >
            R V CHANDAN
          </div>
          <div
            style={{
              width: 140,
              height: 10,
              backgroundColor: '#F03A42',
              marginTop: 36,
            }}
          />
          <div
            style={{
              fontSize: 34,
              color: '#F2F4F8',
              marginTop: 40,
              maxWidth: 900,
              lineHeight: 1.35,
            }}
          >
            Backend engineer — Java, Spring Boot. Payments, identity and
            LLM-backed systems.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 24,
            color: '#8A93A8',
          }}
        >
          <span>Bengaluru, India</span>
          <span>Four case studies</span>
        </div>
      </div>
    ),
    size,
  );
}
