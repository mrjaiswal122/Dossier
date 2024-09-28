
function LoadingScreen (){
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-theme-light dark:bg-black">
      <div className="w-16 h-16 border-4 border-gray-300 border-t-4 border-t-blue-500 rounded-full animate-spin"></div>
      <h1 className="mt-6 text-lg font-bold text-gray-700">Loading...</h1>
    </div>
  );
};

export default LoadingScreen;
