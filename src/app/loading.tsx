export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-aire-400 to-aire-600 rounded-xl flex items-center justify-center mx-auto mb-4 animate-pulse">
          <i className="fas fa-robot text-white text-2xl" />
        </div>
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-aire-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-aire-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-aire-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
