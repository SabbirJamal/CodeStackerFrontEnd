'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [prevPath, setPrevPath] = useState(pathname);
  
  useEffect(() => {
    setPrevPath(pathname);
  }, [pathname]);
  
  const isGoingDeeper = pathname.split('/').length > prevPath.split('/').length;
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ 
          opacity: 0,
          scale: isGoingDeeper ? 0.95 : 1,
          y: isGoingDeeper ? 20 : -20
        }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ 
          opacity: 0,
          scale: isGoingDeeper ? 1 : 0.95,
          y: isGoingDeeper ? -20 : 20
        }}
        transition={{ duration: 0.4 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}