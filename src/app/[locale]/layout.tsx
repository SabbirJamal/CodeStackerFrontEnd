import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import * as React from 'react';
import PageTransition from '@/components/PageTransition';

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
      <PageTransition>
        <div dir={locale === 'ar' ? 'rtl' : 'ltr'}>
          {children}
        </div>
      </PageTransition>
    </NextIntlClientProvider>
  );
}