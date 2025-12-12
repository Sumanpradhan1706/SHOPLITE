export default function LoadingSpinner({ size = 'medium', message = 'Loading...' }) {
  const sizes = {
    small: 'h-8 w-8 border-2',
    medium: 'h-12 w-12 border-3',
    large: 'h-16 w-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div
        className={`${sizes[size]} border-blue-600 border-t-transparent rounded-full animate-spin`}
      ></div>
      {message && (
        <p className="mt-4 text-gray-600 text-center">{message}</p>
      )}
    </div>
  );
}
