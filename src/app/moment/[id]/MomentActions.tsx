'use client';
import { Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MomentActionsProps {
  momentId: string;
  momentDedication: string | null;
}

export default function MomentActions({ momentId, momentDedication }: MomentActionsProps) {
  const handleDownloadCertificate = async () => {
    try {
      const response = await fetch(`/api/certificates/${momentId}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `moment-${momentId}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Error downloading certificate:', error);
    }
  };

  const handleShareMoment = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: momentDedication || 'Dedicated Moment',
          text: `Check out this moment dedicated to eternity on MomentVerse!`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button 
        onClick={handleDownloadCertificate}
        className="premium-button text-lg px-8 py-4 group"
      >
        <Download className="w-5 h-5 mr-3 group-hover:animate-bounce" />
        Download Certificate
      </Button>
      
      <Button 
        onClick={handleShareMoment}
        variant="outline"
        className="glass-card text-white border-white/20 hover:bg-white/10 text-lg px-8 py-4 group"
      >
        <Share2 className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
        Share Moment
      </Button>
    </div>
  );
} 