
import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="w-full py-6 px-4 bg-white border-t">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-sm text-muted-foreground"
          >
            <p>© 2025 Receitas & Drinks AI. Todos os direitos reservados.</p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex items-center gap-1 mt-4 md:mt-0 text-sm text-muted-foreground"
          >
            <span>Feito com</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500" />
            <span>para você aproveitar</span>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
