export default function ProductsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-black/70 rounded-xl shadow-lg p-6 mb-8 border border-[#232323]">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="flex-1 h-12 bg-[#232323] rounded-lg animate-pulse"></div>
          <div className="w-24 h-12 bg-[#232323] rounded-lg animate-pulse"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-black/80 border border-[#232323] rounded-xl animate-pulse h-96 flex flex-col justify-between shadow-lg"
          >
            <div className="h-2/3 bg-[#181818] rounded-t-xl" />
            <div className="p-6 flex-1 flex flex-col justify-end">
              <div className="h-6 bg-[#232323] rounded w-3/4 mb-2" />
              <div className="h-4 bg-[#232323] rounded w-1/2 mb-4" />
              <div className="h-8 bg-[#94C11F] rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
