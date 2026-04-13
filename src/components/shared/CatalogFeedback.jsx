import { AlertCircle, Music2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const variants = {
  error: {
    icon: AlertCircle,
    border: 'border-rose-500/30',
    iconColor: 'text-rose-300',
    titleColor: 'text-white',
  },
  empty: {
    icon: Music2,
    border: 'border-white/10',
    iconColor: 'text-brand',
    titleColor: 'text-white',
  },
};

const CatalogFeedback = ({
  title,
  message,
  actionLabel,
  actionTo,
  tone = 'empty',
  className = '',
}) => {
  const variant = variants[tone] || variants.empty;
  const Icon = variant.icon;

  return (
    <div className={`rounded-2xl border ${variant.border} bg-white/4 p-6 ${className}`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <div className={`rounded-2xl bg-black/20 p-3 ${variant.iconColor}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className={`text-lg font-semibold ${variant.titleColor}`}>{title}</h3>
            <p className="max-w-2xl text-sm leading-6 text-text-muted">{message}</p>
          </div>
        </div>

        {actionLabel && actionTo ? (
          <Link
            to={actionTo}
            className="inline-flex rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            {actionLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export default CatalogFeedback;
