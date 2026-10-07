import { homeContent } from "@/config/content/home";
import { testimonials } from "@/config/content/testimonials";
import { getFeaturedProducts } from "@/services/catalog";
import { toCard } from "@/lib/catalog-view";
import { pageMetadata } from "@/lib/seo";
import { HeroSlider } from "@/sections/HeroSlider";
import { FeaturedProducts } from "@/sections/FeaturedProducts";
import { ExperienceBanner } from "@/sections/ExperienceBanner";
import { CategoryMosaic } from "@/sections/CategoryMosaic";
import { PromoVideo } from "@/sections/PromoVideo";
import { Testimonials } from "@/sections/Testimonials";

export const metadata = pageMetadata({ title: "Home", path: "/" });

export default async function HomePage() {
  const featured = (await getFeaturedProducts(homeContent.featured.limit)).map(toCard);
  return (
    <>
      <HeroSlider slides={homeContent.hero} />
      <FeaturedProducts eyebrow={homeContent.featured.eyebrow} title={homeContent.featured.title} products={featured} />
      <ExperienceBanner icon={homeContent.experience.icon} text={homeContent.experience.text} />
      <CategoryMosaic tiles={homeContent.mosaic} />
      <PromoVideo {...homeContent.promo} />
      <Testimonials items={testimonials} />
    </>
  );
}
