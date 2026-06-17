'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * Overlay shell for the intercepted product route. Closing returns to the
 * previous route (the grid) via router.back(), which un-mounts the @modal slot.
 */
export default function ProductModal({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') router.back();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [router]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-8"
      onClick={() => router.back()}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl shadow-2xl rounded-xl max-h-[90vh]"
      >
        <button
          onClick={() => router.back()}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 text-gray-400 hover:text-black transition-colors"
        >
          <X size={24} />
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
}
