import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  // geeting the locale from the request
  const requested = await requestLocale;
  const locale = requested || 'en';
  
  // loading messages for this locale
  const messages = (await import(`../../messages/${locale}.json`)).default;
  
  return {
    locale,
    messages,
    timeZone: 'Asia/Muscat' 
  };
});