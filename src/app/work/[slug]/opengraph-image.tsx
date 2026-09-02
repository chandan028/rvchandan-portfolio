import { ImageResponse } from 'next/og';
import { caseStudies, getCaseStudy } from '@/data/case-studies';
import { site } from '@/data/site';

export const dynamic = 'force-static';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Case study';

export function generateStaticParams() {
  return caseStudies.map((study) => ({ slug: study.slug }));
}

/** One prerendered PNG per case study, so a shared link says which one it is. */
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const study = getCaseStudy(slug);

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
              fontSize: 24,
              color: '#8A93A8',
              letterSpacing: '0.14em',
            }}
          >
            CASE STUDY
          </div>
          <div
            style={{
              fontSize: 68,
              fontWeight: 800,
              color: '#F2F4F8',
              letterSpacing: '-0.02em',
              lineHeight: 1.08,
              marginTop: 26,
              maxWidth: 980,
            }}
          >
            {study?.title ?? 'Case study'}
          </div>
          <div
            style={{
              width: 120,
              height: 8,
              backgroundColor: '#F03A42',
              marginTop: 32,
            }}
          />
          <div
            style={{
              fontSize: 28,
              color: '#8A93A8',
              marginTop: 32,
              maxWidth: 940,
              lineHeight: 1.4,
            }}
          >
            {study?.hook ?? ''}
          </div>
        </div>

        <div style={{ display: 'flex', fontSize: 24, color: '#F2F4F8' }}>
          {site.name}
        </div>
      </div>
    ),
    size,
  );
}
