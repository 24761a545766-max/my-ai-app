export default function Home() {
  return (
    <main className="min-h-screen w-full bg-[url('https://unsplash.com/s/photos/4k-laptop-wallpaper?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center bg-no-repeat bg-fixed">
      {/* Dark overlay with blur to make text readable on all devices */}
      <div className="flex items-center justify-center min-h-screen bg-black/50 backdrop-blur-sm">
        <div className="text-center">
          <h1 className="text-white text-6xl md:text-8xl font-black tracking-tight drop-shadow-2xl">
            NOVA
          </h1>
          <p className="text-blue-200 mt-4 text-xl font-light tracking-widest uppercase">
            Ethical Sentinel System
          </p>
        </div>
      </div>
    </main>
  );
}