import ClaimStepper from '@/components/ClaimStepper';
import StarField from '@/components/StarField';

export default function ClaimPage() {
  return (
    <main className="relative min-h-screen personalize-bg flex items-center justify-center py-20">
      <StarField />
      <div className="relative z-10 max-w-2xl w-full mx-auto px-4">
        <div className="glass-card p-8 shadow-2xl">
          <h1 className="text-4xl font-bold mb-10 text-center night-sky-gradient-text">Claim Your Moment</h1>
          <ClaimStepper />
        </div>
      </div>
    </main>
  );
} 