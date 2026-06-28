export default function Loading() {
  return (
    <div className="space-y-5 animate-pulse">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="h-64 bg-gray-900 border border-gray-800 rounded-2xl" />
        <div className="h-64 bg-gray-900 border border-gray-800 rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="h-72 bg-gray-900 border border-gray-800 rounded-2xl" />
        <div className="h-72 bg-gray-900 border border-gray-800 rounded-2xl" />
      </div>
      <div className="h-48 bg-gray-900 border border-gray-800 rounded-2xl" />
    </div>
  );
}