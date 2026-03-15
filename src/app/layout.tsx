import { Inter, Cairo } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });
const cairo = Cairo({ 
  subsets: ['arabic'],
  variable: '--font-cairo',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" dir="ltr">
      <body className={`${inter.className} ${cairo.variable}`}>
        {children}
      </body>
    </html>
  );
}