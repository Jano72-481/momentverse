import Image from 'next/image';
import Link from 'next/link';
import { getTrendingMoments } from '@/lib/db'; // implement

export default async function TrendingMoments() {
  const moments = await getTrendingMoments(6);
  if (!moments.length) return null;

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {moments.map((m) => (
        <Link
          href={`/verify/${m.id}`}
          key={m.id}
          className="rounded-xl bg-brand-900/60 backdrop-blur p-4 hover:bg-brand-900/80 transition"
        >
          <Image
            src={'/placeholder.png'}
            alt={m.dedication ?? 'Moment'}
            width={400}
            height={210}
            className="rounded-lg mb-2 object-cover"
          />
          <h3 className="font-medium">{m.dedication ?? new Date(m.startTime).toLocaleString()}</h3>
          <p className="text-sm text-brand-100">
            {new Date(m.startTime).toLocaleString()}
          </p>
        </Link>
      ))}
    </div>
  );
} 