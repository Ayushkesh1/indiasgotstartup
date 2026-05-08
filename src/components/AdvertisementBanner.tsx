import { useAdvertisements, trackAdClick } from "@/hooks/useAdvertisements";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

const AdvertisementBanner = () => {
  const { data: ads, isLoading } = useAdvertisements();

  if (isLoading || !ads || ads.length === 0) {
    return null;
  }

  const handleAdClick = (ad: any) => {
    trackAdClick(ad.id);
    window.open(ad.link_url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="relative py-12 my-8 overflow-hidden bg-background border-y border-border shadow-[0_0_50px_rgba(0,0,0,0.5)]">
      {/* Dynamic Ambient Background for Sponsored Area */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-900/10 via-neutral-950 to-neutral-950 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] max-w-4xl h-[100px] bg-amber-600/10 blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]"></span>
            </span>
            <span className="text-sm md:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-500 uppercase tracking-widest drop-shadow-[0_0_10px_rgba(245,158,11,0.3)]">
              Sponsored Excellence
            </span>
          </div>
        </div>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full group/carousel"
        >
          <CarouselContent className="-ml-6">
            {ads.slice(0, 6).map((ad) => (
              <CarouselItem key={ad.id} className="pl-6 md:basis-1/2 lg:basis-1/3">
                <div 
                  className="group relative cursor-pointer overflow-hidden rounded-[2rem] bg-white/70 dark:bg-zinc-900/40 backdrop-blur-xl border border-border hover:border-amber-500/40 transition-all duration-700 hover:shadow-[0_0_40px_rgba(245,158,11,0.15)] flex flex-col h-full"
                  onClick={() => handleAdClick(ad)}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/5 via-transparent to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                  
                  <div className="relative aspect-[16/9] w-full overflow-hidden">
                    <img
                      src={ad.image_url}
                      alt={ad.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    
                    <div className="absolute top-4 right-4 bg-slate-50/80 dark:bg-black/40 backdrop-blur-md border border-border rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 shadow-[0_0_15px_rgba(0,0,0,0.5)] hidden sm:block">
                      <ExternalLink className="h-4 w-4 text-amber-400" />
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end">
                      <div className="w-full">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full bg-amber-500/20 backdrop-blur-md border border-amber-500/30 text-[10px] sm:text-xs font-bold text-amber-300 uppercase tracking-widest relative overflow-hidden group-hover:border-amber-400 group-hover:text-amber-200 transition-colors">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                          Featured
                        </div>
                        <h3 className="font-extrabold text-xl sm:text-2xl text-foreground dark:text-white mb-2 line-clamp-2 md:line-clamp-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-amber-300 group-hover:to-orange-400 transition-all translation-duration-500">
                          {ad.title}
                        </h3>
                        {ad.description && (
                          <p className="text-xs sm:text-sm text-foreground/80 line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                            {ad.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden sm:block opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300">
            <CarouselPrevious className="-left-5 h-12 w-12 bg-black/50 border-border hover:bg-black hover:text-amber-400 hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] backdrop-blur-xl text-foreground dark:text-white z-20" />
            <CarouselNext className="-right-5 h-12 w-12 bg-black/50 border-border hover:bg-black hover:text-amber-400 hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] backdrop-blur-xl text-foreground dark:text-white z-20" />
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default AdvertisementBanner;
