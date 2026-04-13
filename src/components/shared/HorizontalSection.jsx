import { Link } from 'react-router-dom';

const HorizontalSection = ({ title, subtitle, to, children }) => {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between px-1">
        <div>
          <h2 className="text-xl font-bold text-white md:text-2xl">{title}</h2>
          {subtitle && <p className="text-sm text-text-subdued">{subtitle}</p>}
        </div>
        {to && (
          <Link
            to={to}
            className="text-xs font-semibold uppercase tracking-[0.2em] text-text-subdued transition-colors hover:text-white"
          >
            Show all
          </Link>
        )}
      </div>
      
      <div className="flex -mx-4 px-4 gap-4 overflow-x-auto pb-4 scrollbar-none snap-x touch-pan-x">
        {children}
      </div>
    </section>
  );
};

export default HorizontalSection;
