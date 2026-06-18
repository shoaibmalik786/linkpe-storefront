'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { Store, Category } from '@linkpe-storefront/sdk';

export default function Footer({ store, categories = [] }: { store?: Store | null; categories?: Category[] }) {
  const logoUrl = store?.store_logo_url ?? null;
  const storeName = store?.business_name ?? 'Store';
  const bio = store?.store_bio ?? null;
  const contact = store?.contact;
  const social = store?.social;

  const socialLinks = [
    { label: 'Instagram', href: social?.instagram },
    { label: 'Facebook', href: social?.facebook },
    { label: 'Twitter', href: social?.twitter },
    { label: 'YouTube', href: social?.youtube },
    { label: 'LinkedIn', href: social?.linkedin },
  ].filter((s): s is { label: string; href: string } => Boolean(s.href));

  const fade = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-50px' },
    transition: { duration: 0.5, delay: 0.05 },
  };

  return (
    <footer className="w-full bg-brand-dark text-white pt-16 lg:pt-24 pb-8 border-t border-white/10 relative z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 mb-16">
          {/* Brand + contact + newsletter */}
          <motion.div className="lg:col-span-5 flex flex-col items-start" {...fade}>
            <Link href="/" className="flex items-center gap-2 mb-6">
              {logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoUrl} alt={storeName} className="h-12 w-auto max-w-[200px] object-contain bg-white rounded-lg p-1.5" />
              ) : (
                <span className="text-2xl font-extrabold tracking-tight text-white">{storeName}</span>
              )}
            </Link>

            {bio && <p className="text-sm font-medium text-white/80 mb-6 max-w-sm leading-relaxed">{bio}</p>}

            <div className="text-sm font-medium text-white space-y-2 mb-8">
              {contact?.address && <p>Address: {contact.address}</p>}
              {contact?.email && <p>E-mail: <a href={`mailto:${contact.email}`} className="hover:text-brand-accent">{contact.email}</a></p>}
              {contact?.phone && <p>Phone: <a href={`tel:${contact.phone}`} className="hover:text-brand-accent">{contact.phone}</a></p>}
            </div>
          </motion.div>

          {/* Shop by category */}
          {categories.length > 0 && (
            <motion.div className="lg:col-span-3" {...fade}>
              <h4 className="text-lg font-extrabold text-white mb-6">Shop by Category</h4>
              <ul className="flex flex-col gap-3">
                {categories.slice(0, 6).map((cat) => (
                  <li key={cat.id}>
                    <Link href={`/shop?category=${encodeURIComponent(cat.slug)}`} className="text-sm font-medium text-white/70 hover:text-brand-accent transition-colors">
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Quick links */}
          <motion.div className="lg:col-span-2" {...fade}>
            <h4 className="text-lg font-extrabold text-white mb-6">Quick Links</h4>
            <ul className="flex flex-col gap-3">
              <li><Link href="/" className="text-sm font-medium text-white/70 hover:text-brand-accent transition-colors">Home</Link></li>
              <li><Link href="/shop" className="text-sm font-medium text-white/70 hover:text-brand-accent transition-colors">Shop</Link></li>
              <li><Link href="/cart" className="text-sm font-medium text-white/70 hover:text-brand-accent transition-colors">Cart</Link></li>
              <li><Link href="/account/orders" className="text-sm font-medium text-white/70 hover:text-brand-accent transition-colors">My Orders</Link></li>
            </ul>
          </motion.div>

          {/* Follow us */}
          {socialLinks.length > 0 && (
            <motion.div className="lg:col-span-2" {...fade}>
              <h4 className="text-lg font-extrabold text-white mb-6">Follow Us</h4>
              <div className="flex flex-col gap-3">
                {socialLinks.map(({ label, href }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-white/70 hover:text-brand-accent transition-colors">
                    {label}
                  </a>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="w-full flex flex-col md:flex-row items-center justify-center pt-8 border-t border-white/10 gap-4">
          <p className="text-sm font-medium text-white">
            © {new Date().getFullYear()} <span className="font-extrabold text-brand-accent">{storeName}</span>. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
