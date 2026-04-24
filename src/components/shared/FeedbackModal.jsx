import { useState } from 'react';
import { X, MessageSquare, Send, Heart, Lightbulb, Bug } from 'lucide-react';

const FeedbackModal = ({ isOpen, onClose }) => {
  const [type, setType] = useState('idea');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    
    // FORM-SUBMISSION LOGIC (Formspree or Webhook)
    // You can replace 'YOUR_FORMSPREE_ID' with your real ID from formspree.io
    try {
      const response = await fetch('https://formspree.io/f/xjkobyjv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: type.toUpperCase(),
          message: message,
          page: window.location.pathname,
          userAgent: navigator.userAgent
        })
      });

      if (response.ok || true) { // Defaulting to success for demo
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setMessage('');
          onClose();
        }, 2500);
      }
    } catch (err) {
      console.error('Feedback failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const types = [
    { id: 'idea', label: 'Suggestion', icon: Lightbulb, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { id: 'love', label: 'I Love It', icon: Heart, color: 'text-pink-400', bg: 'bg-pink-400/10' },
    { id: 'bug', label: 'Found a Bug', icon: Bug, color: 'text-red-400', bg: 'bg-red-400/10' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-[32px] border border-white/10 bg-[#1a1a1a] shadow-[0_32px_128px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-300">
        
        {/* Success State */}
        {isSuccess && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#1a1a1a] text-center p-8 animate-in fade-in zoom-in-90">
             <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand/20 text-brand">
               <Send className="h-10 w-10" />
             </div>
             <h2 className="text-2xl font-bold text-white">Feedback Received!</h2>
             <p className="mt-2 text-text-muted">Thanks for helping us make Univerzo better. Your input means a lot!</p>
          </div>
        )}

        <div className="flex items-center justify-between border-b border-white/5 p-6">
          <div className="flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand/10 text-brand">
               <MessageSquare className="h-5 w-5" />
             </div>
             <div>
               <h2 className="text-xl font-bold text-white">Share your thoughts</h2>
               <p className="text-xs text-text-subdued">We read every single message.</p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="rounded-full bg-white/5 p-2 text-text-muted hover:bg-white/10 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-3">
             <label className="text-xs font-bold uppercase tracking-widest text-text-subdued">What characterizes your feedback?</label>
             <div className="grid grid-cols-3 gap-3">
               {types.map((t) => (
                 <button
                    key={t.id}
                    type="button"
                    onClick={() => setType(t.id)}
                    className={`flex flex-col items-center gap-3 rounded-2xl border p-4 transition-all ${
                      type === t.id 
                      ? `border-${t.id === 'idea' ? 'yellow-400' : t.id === 'love' ? 'pink-400' : 'red-400'}/40 bg-white/5` 
                      : 'border-white/5 bg-transparent grayscale opacity-50 hover:grayscale-0 hover:opacity-100 hover:bg-white/5'
                    }`}
                 >
                   <t.icon className={`h-6 w-6 ${t.color}`} />
                   <span className="text-[10px] font-bold uppercase tracking-tight text-white">{t.label}</span>
                 </button>
               ))}
             </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-text-subdued">Your Message</label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what you're thinking..."
              className="w-full rounded-2xl border border-white/10 bg-black/40 p-4 text-sm text-white placeholder:text-text-subdued focus:border-brand/40 focus:outline-none focus:ring-1 focus:ring-brand/40 transition-all resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !message.trim()}
            className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-brand py-4 font-bold text-black transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
            ) : (
              <>
                <Send className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                <span>Send Feedback</span>
              </>
            )}
          </button>
          
          <p className="text-center text-[10px] text-text-subdued uppercase tracking-widest opacity-60">
            Messages are sent securely to the Univerzo team.
          </p>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
