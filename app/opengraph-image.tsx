import { ImageResponse } from 'next/og';

export const alt = 'Sacrament Meeting Planner for the Springfield 1st Ward';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

/**
 * Social share image generated at build time so every link to the planner
 * previews the same navy-and-brass card used in the site header.
 */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1e3a5f',
          color: '#faf7f2',
          padding: '80px 96px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            fontSize: 32,
            letterSpacing: 8,
            textTransform: 'uppercase',
            color: '#d8b48c',
          }}
        >
          Springfield 1st Ward
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 92,
            marginTop: 32,
            textAlign: 'center',
            lineHeight: 1.1,
          }}
        >
          Sacrament Meeting Planner
        </div>
        <div
          style={{
            display: 'flex',
            fontSize: 36,
            marginTop: 32,
            color: '#e6ded2',
            textAlign: 'center',
          }}
        >
          Plan, review, and share the weekly agenda
        </div>
        <div
          style={{
            display: 'flex',
            width: 240,
            height: 6,
            marginTop: 48,
            background: '#8a5a2b',
            borderRadius: 3,
          }}
        />
      </div>
    ),
    { ...size },
  );
}
