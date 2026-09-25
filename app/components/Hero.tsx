export default function Hero() {
  return (
    <section className="relative min-h-screen w-full bg-black flex flex-col items-center justify-center text-center px-4 md:px-6 overflow-hidden">
      <div
        className="absolute inset-0 opacity-60"
        style={{
          background:
            'radial-gradient(circle at 50% 40%, rgba(232,80,26,0.25) 0%, rgba(0,0,0,0.9) 60%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center pt-40 md:pt-56">
        <p className="mt-6 md:mt-8 text-gray-300 text-sm sm:text-base md:text-lg max-w-xs sm:max-w-md md:max-w-xl">
          Personal portfolio — design, creativity, and visual work samples.
        </p>

        <a
          href="#portfolio"
          className="mt-8 md:mt-10 px-6 md:px-10 py-3 md:py-4 bg-[#E8501A] text-white text-xs md:text-sm tracking-widest uppercase font-semibold rounded-full hover:opacity-90 transition"
        >
          View Portfolio
        </a>
      </div>

      <div className="absolute bottom-6 md:bottom-10 flex flex-col items-center gap-2 md:gap-3 z-10">
        <span className="text-[#E8501A] text-[10px] md:text-xs tracking-widest uppercase font-semibold">
          Scroll Down
        </span>
        <div className="w-5 h-8 md:w-6 md:h-10 border-2 border-[#E8501A] rounded-full flex items-start justify-center p-1">
          <div className="w-1 h-2 bg-[#E8501A] rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
}