import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { LocaleProvider } from '@/i18n/locale-context';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'MintBit 薄荷比特 - 个性化维生素AI推荐',
  description: '基于AI的个性化维生素推荐平台，科学问卷+体检数据+智能分析，为你定制专属营养方案',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className={`${inter.className} bg-mint-canvas text-mint-ink antialiased`}>
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
