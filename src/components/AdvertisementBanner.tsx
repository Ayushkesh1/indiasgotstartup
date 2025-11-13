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
    <div className="border-b border-border bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Sponsored Content
            </span>
          </div>
        </div>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {ads.map((ad) => (
              <CarouselItem key={ad.id} className="md:basis-1/2 lg:basis-1/3">
                <Card 
                  className="group cursor-pointer overflow-hidden transition-all hover:shadow-lg border-border/50"
                  onClick={() => handleAdClick(ad)}
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={ad.image_url}
                      alt={ad.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <ExternalLink className="absolute top-2 right-2 h-4 w-4 text-background opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm mb-1 line-clamp-1">
                      {ad.title}
                    </h3>
                    {ad.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {ad.description}
                      </p>
                    )}
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-4" />
          <CarouselNext className="-right-4" />
        </Carousel>
      </div>
    </div>
  );
};

export default AdvertisementBanner;
