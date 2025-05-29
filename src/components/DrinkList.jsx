import React from 'react';
import { motion } from 'framer-motion';
import DrinkCard from '@/components/DrinkCard';

const DrinkList = ({ drinks }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {drinks.map((drink, index) => (
        <motion.div key={index} variants={itemVariants}>
          <DrinkCard drink={drink} />
        </motion.div>
      ))}
      
      {drinks.length === 0 && (
        <motion.div 
          variants={itemVariants}
          className="col-span-full text-center py-12"
        >
          <p className="text-muted-foreground">
            Seus drinks aparecerão aqui. Adicione ingredientes e busque drinks acima!
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DrinkList;