'use client';

import { useScroll } from 'framer-motion';

import { _pricingHome } from 'src/_mock';
import MainLayout from 'src/layouts/main';

import ScrollProgress from 'src/components/scroll-progress';

import HomeHero from '../home-hero';
import HomeFAQs from '../home-faqs';
import HomeNewStart from '../home-new-start';
import HomeCombination from '../home-combination';
import HomeForDesigner from '../home-for-designer';
import HomeAdvertisement from '../home-advertisement';
import PricingHome from '../../pricing/home/pricing-home';
import HomeFeatureHighlights from '../home-feature-highlights';
import HomeFlexibleComponents from '../home-flexible-components';
import { useRouter } from 'next/navigation';
import { paths } from 'src/routes/paths';

// ----------------------------------------------------------------------

export default function HomeView() {
  const router = useRouter();

  const { scrollYProgress } = useScroll();

  router.replace(paths.eCommerce.account.personal);

  return (
    <MainLayout>
      <ScrollProgress scrollYProgress={scrollYProgress} />

      <HomeHero />

      <HomeNewStart />

      <HomeFlexibleComponents />

      <HomeFeatureHighlights />

      <HomeForDesigner />

      <PricingHome plans={_pricingHome} />

      <HomeFAQs />

      <HomeCombination />

      <HomeAdvertisement />
    </MainLayout>
  );
}
