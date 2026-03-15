'use client';

interface CategoryCardProps {
  icon: string;
  title: string;
  count: number;
  color: string;
  locale: string;
}

export default function CategoryCard({ icon, title, count, color, locale }: CategoryCardProps) {
  return (
    <div className={`${color} rounded-lg p-6 text-center shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1`}>
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm opacity-90">
        {count} {locale === 'en' ? 'places' : 'مكان'}
      </p>
    </div>
  );
}