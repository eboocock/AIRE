export function SocialProof() {
  return (
    <section className="py-8 px-4 bg-gray-900/50 border-y border-gray-800">
      <div className="max-w-6xl mx-auto flex flex-wrap justify-center items-center gap-8 text-center">
        <div>
          <div className="text-3xl font-black text-white">$299</div>
          <div className="text-gray-500 text-sm">Starting price</div>
        </div>
        <div className="w-px h-12 bg-gray-700 hidden sm:block" />
        <div>
          <div className="text-3xl font-black text-white">10 min</div>
          <div className="text-gray-500 text-sm">To create a listing</div>
        </div>
        <div className="w-px h-12 bg-gray-700 hidden sm:block" />
        <div>
          <div className="text-3xl font-black text-white">WA</div>
          <div className="text-gray-500 text-sm">Available now</div>
        </div>
        <div className="w-px h-12 bg-gray-700 hidden sm:block" />
        <div>
          <div className="text-3xl font-black text-white">$0</div>
          <div className="text-gray-500 text-sm">Brokerage fees</div>
        </div>
      </div>
    </section>
  );
}
