import React from 'react';
import { motion } from 'framer-motion';
import { GlassWater } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full py-6 px-4 bg-white shadow-md">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2"
        >
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-full">
            <GlassWater className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Drinks</h1>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex items-center mt-4 sm:mt-0"
        >
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GlassWater className="h-4 w-4" />
            <span>Descubra Drinks Incríveis</span>
            <span className="mx-2">•</span>
            <span>Dose Extra</span>
          </div>
        </motion.div>
      </div>
    </header>
  );
};

export default Header;