const TrackGrid = ({ children, className = '' }) => {
  return (
    <div className={`grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 ${className}`.trim()}>
      {children}
    </div>
  );
};

export default TrackGrid;
