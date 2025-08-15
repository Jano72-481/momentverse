import { getMomentById } from '@/lib/db'; // implement as needed
import CertificatePreview from '@/components/CertificatePreview';

export default async function VerifyPage({
  params
}: {
  params: { id: string };
}) {
  const moment = await getMomentById(params.id);

  if (!moment)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl">Moment not found.</p>
      </div>
    );

  return (
    <main className="max-w-4xl mx-auto px-4 py-20">
      <h1 className="text-3xl font-semibold mb-8">
        {moment.dedication ? moment.dedication : 'Verified Moment'}
      </h1>
      <CertificatePreview certUrl={moment.certificateUrl || ''} verifyUrl={`/verify/${moment.id}`} />
    </main>
  );
} 