import { useLocation } from 'react-router-dom';

/**
 * Route feedback without effect-driven state churn.
 * Remounting this bar on navigation restarts the CSS animation.
 */
const NavigationProgressBar = () => {
  const location = useLocation();
  const transitionKey = location.key || location.pathname;

  return (
    <div
      key={transitionKey}
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[9999] h-[3px] overflow-hidden"
    >
      <div className="nav-progress-bar h-full origin-left bg-brand shadow-[0_0_10px_rgba(30,215,96,0.5)]" />
    </div>
  );
};

export default NavigationProgressBar;
