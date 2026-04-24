import { useState } from 'react';
import { Share2, Check } from 'lucide-react';

const ShareButton = ({ title, text, url, className = '' }) => {
  const [copied, setCopied] = useState(false);

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const shareData = {
      title: title || 'Univerzo Music',
      text: text || 'Check this out on Univerzo Music!',
      url: url || window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Share failed:', err);
      }
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`flex items-center justify-center transition-all ${className}`}
      aria-label="Share"
    >
      {copied ? <Check className="h-4 w-4 text-brand" /> : <Share2 className="h-4 w-4" />}
    </button>
  );
};

export default ShareButton;
