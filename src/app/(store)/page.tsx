import { HeroCampaign } from "@/components/home/HeroCampaign";
import { CollectionTiles } from "@/components/home/CollectionTiles";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { Manifesto } from "@/components/home/Manifesto";
import { EditorialSection } from "@/components/home/EditorialSection";
import { RegisterTeaser } from "@/components/home/RegisterTeaser";
import { Lookbook } from "@/components/home/Lookbook";
import { SocialGrid } from "@/components/home/SocialGrid";

export default function HomePage() {
  return (
    <>
      <HeroCampaign />
      <CollectionTiles />
      <FeaturedProducts />
      <Manifesto />
      <EditorialSection />
      <RegisterTeaser />
      <Lookbook />
      <SocialGrid />
    </>
  );
}
