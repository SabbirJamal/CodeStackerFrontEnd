'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = useLocale();

  const switchLanguage = (newLocale: string) => {
    // reeplace the locale in the path
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <div className="flex gap-2 items-center">
      <button
        onClick={() => switchLanguage('en')}
        className={`px-3 py-1 rounded transition ${
          currentLocale === 'en' 
            ? 'bg-oman-green text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        English
      </button>
      <button
        onClick={() => switchLanguage('ar')}
        className={`px-3 py-1 rounded transition ${
          currentLocale === 'ar' 
            ? 'bg-oman-green text-white' 
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        العربية
      </button>
    </div>
  );
}