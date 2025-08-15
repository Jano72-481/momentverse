'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Share2, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  certUrl: string;
  verifyUrl: string;
}

export default function CertificatePreview({ certUrl, verifyUrl }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(certUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'moment-certificate.pdf';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Certificate downloaded!');
    } catch (error) {
      toast.error('Failed to download certificate');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Moment in Eternity',
          text: 'Check out my moment dedicated to eternity!',
          url: verifyUrl,
        });
        toast.success('Shared successfully!');
      } catch (error) {
        toast.error('Failed to share');
      }
    } else {
      // Fallback to copying to clipboard
      try {
        await navigator.clipboard.writeText(verifyUrl);
        toast.success('Link copied to clipboard!');
      } catch (error) {
        toast.error('Failed to copy link');
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Certificate Preview */}
      <motion.div
        className="relative rounded-xl overflow-hidden bg-brand-900/60 backdrop-blur"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <iframe
          src={certUrl}
          className="w-full h-96"
          title="Certificate Preview"
        />
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        className="flex flex-wrap gap-4 justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <button
          onClick={handleDownload}
          disabled={isLoading}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-500 hover:bg-brand-600 transition-colors disabled:opacity-50"
        >
          <Download className="w-5 h-5" />
          {isLoading ? 'Downloading...' : 'Download Certificate'}
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-700 hover:bg-brand-800 transition-colors"
        >
          <Share2 className="w-5 h-5" />
          Share
        </button>

        <a
          href={verifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-900 hover:bg-brand-800 transition-colors"
        >
          <ExternalLink className="w-5 h-5" />
          View Online
        </a>
      </motion.div>

      {/* Verification Info */}
      <motion.div
        className="text-center text-brand-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-sm">
          This certificate is permanently stored on the blockchain and can be verified at any time.
        </p>
      </motion.div>
    </div>
  );
} 