import { memo } from 'react';

const SkeletonCard = memo(() => {
  return (
    <div className="bg-bg-elevated/40 p-4 rounded-xl animate-pulse cursor-wait">
      <div className="relative mb-4 aspect-square rounded-md bg-white/5 shadow-lg"></div>
      <div className="flex justify-between items-start">
        <div className="flex-1 pr-2">
          <div className="h-4 bg-white/10 rounded-md w-3/4 mb-2"></div>
          <div className="h-3 bg-white/5 rounded-md w-1/2"></div>
        </div>
      </div>
    </div>
  );
});

export default SkeletonCard;
