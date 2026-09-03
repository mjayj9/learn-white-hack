import type { Metadata } from 'next';
import './globals.css';

const siteOrigin =
  process.env.NEXT_PUBLIC_SITE_ORIGIN ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: '화이트랩 | 안전한 웹 보안 실습실',
  description:
    '브라우저 개발자 도구와 웹 보안을 안전한 모의 환경에서 배우는 한국어 실습 앱',
  applicationName: '화이트랩',
  openGraph: {
    title: '화이트랩 | 안전한 웹 보안 실습실',
    description:
      '브라우저 개발자 도구와 웹 보안을 안전한 모의 환경에서 배우는 한국어 실습 앱',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: '화이트랩 안전한 웹 보안 실습실',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '화이트랩 | 안전한 웹 보안 실습실',
    description:
      '브라우저 개발자 도구와 웹 보안을 안전하게 배우는 한국어 실습 앱',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
