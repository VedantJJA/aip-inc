export default function Loading() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-t-accent border-r-accent border-b-border-primary border-l-border-primary rounded-full animate-spin"></div>
        <p className="text-text-secondary font-medium tracking-wide animate-pulse">Loading...</p>
      </div>
    </div>
  );
}
