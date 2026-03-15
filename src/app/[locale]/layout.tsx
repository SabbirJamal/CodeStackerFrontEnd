import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter, Cairo } from 'next/font/google';
import * as React from 'react';
import PageTransition from '@/components/PageTransition'; // Import the transition component
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });
const cairo = Cairo({ 
  subsets: ['arabic'],
  variable: '--font-cairo',
});

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <div className={`${inter.className} ${cairo.variable}`} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
        <PageTransition>
          {children}
        </PageTransition>
      </div>
    </NextIntlClientProvider>
  );
}