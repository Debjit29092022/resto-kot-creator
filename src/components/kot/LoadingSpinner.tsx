
export const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-[calc(100vh-80px)]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
};
