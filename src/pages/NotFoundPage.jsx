import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import Seo from '../components/seo/Seo';

const NotFoundPage = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <Seo
        title="Page Not Found | Univerzo Music"
        description="This page does not exist on Univerzo Music."
        path="/404"
        noindex
      />

      <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-white/10 bg-white/6">
        <Compass className="h-8 w-8 text-brand" />
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-text-subdued">404</p>
        <h1 className="text-4xl font-black tracking-tight text-white">This route drifted off beat.</h1>
        <p className="max-w-xl text-sm leading-6 text-text-muted">
          The page you tried to open does not exist in the current app shell. Jump back into discovery or search the live catalog instead.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition-transform hover:scale-[1.02]"
        >
          Go home
        </Link>
        <Link
          to="/search"
          className="inline-flex rounded-full border border-white/10 bg-white/6 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
        >
          Open search
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
