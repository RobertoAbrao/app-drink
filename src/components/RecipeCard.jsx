/*import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Utensils, ChefHat, Share2 } from 'lucide-react';

const RecipeCard = ({ recipe }) => {
  const { title, description, ingredients, instructions, prepTime, difficulty } = recipe;

  const handleShare = () => {
    const text = `📋 *${title}*\n\n${description}\n\n🥣 Ingredientes:\n- ${ingredients.join('\n- ')}\n\n👨‍🍳 Modo de Preparo:\n${instructions.map((s, i) => `${i + 1}. ${s}`).join('\n')}`;

    if (navigator.share) {
      navigator.share({
        title,
        text,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(text)
        .then(() => alert('Receita copiada para a área de transferência!'))
        .catch(() => alert('Erro ao copiar para a área de transferência.'));
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="h-full overflow-hidden recipe-card border-none shadow-md hover:shadow-xl">
        <CardHeader className="pb-2 gradient-bg text-white">
          <CardTitle className="text-xl">{title}</CardTitle>
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center text-white/90 text-sm">
              <Clock className="h-4 w-4 mr-1" />
              <span>{prepTime}</span>
            </div>
            <div className="flex items-center text-white/90 text-sm">
              <ChefHat className="h-4 w-4 mr-1" />
              <span>{difficulty}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <CardDescription className="text-sm mb-4">{description}</CardDescription>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm mb-2 flex items-center">
                <Utensils className="h-4 w-4 mr-2 text-primary" />
                Ingredientes
              </h4>
              <ul className="text-sm space-y-1 list-disc list-inside">
                {ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-sm mb-2 flex items-center">
                <ChefHat className="h-4 w-4 mr-2 text-primary" />
                Modo de Preparo 879798
              </h4>
              <ol className="text-sm space-y-1 list-decimal list-inside">
                {instructions.map((step, index) => (
                  <li key={index} className="mb-2">
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <Button variant="outline" className="w-full" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Compartilhar Receita
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default RecipeCard;*/
