import Header from './components/Header';
import Hero from './components/Hero';
import Categories from './components/Categories';
import Trending from './components/Trending';
import VideoBanner from './components/VideoBanner';
import PopularProducts from './components/PopularProducts';
import TrustedPartners from './components/TrustedPartners';
import LatestPosts from './components/LatestPosts';
import InstagramFeed from './components/InstagramFeed';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-brand-bg text-brand-dark overflow-hidden">
      <Header /> 
      <Hero />
      <Categories /> 
      <Trending />
      <VideoBanner />
      <PopularProducts />
      <TrustedPartners />
      <LatestPosts />
      <InstagramFeed />
      <Footer />
    </main>
  );
}