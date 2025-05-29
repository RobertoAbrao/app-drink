import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Utensils, CheckSquare, Clock, BarChart3, Share2, MessageSquare } from 'lucide-react';

const splitIngredientsString = str =>
  str
    .split(/[;.]/)
    .map(s => s.trim())
    .filter(Boolean);

const RecipeDisplay = ({ recipe }) => {
  if (!recipe) return null;

  const { title, description, ingredients, instructions, prepTime, difficulty, imageUrl } = recipe;

  const ingredientsList = Array.isArray(ingredients)
    ? ingredients
    : splitIngredientsString(ingredients);

  const getShareText = () => {
    return `📋 *${title}*\n\n${description}\n\n🥣 *Ingredientes:*\n- ${ingredientsList.join('\n- ')}\n\n👨‍🍳 *Modo de Preparo:*\n${instructions.map((s, i) => `${i + 1}. ${s}`).join('\n')}`;
  };

  const handleShare = async () => {
    const shareContent = {
      title: title,
      text: getShareText()
    };

    try {
      // 1. Tenta usar o plugin do Capacitor se estiver disponível
      if (window.Capacitor?.isNative && window.Capacitor.Plugins?.Share) {
        await window.Capacitor.Plugins.Share.share(shareContent);
      }
      // 2. Fallback para Web Share API
      else if (navigator.share) {
        await navigator.share(shareContent);
      }
      // 3. Fallback para copiar
      else {
        await navigator.clipboard.writeText(shareContent.text);
        alert('Receita copiada para a área de transferência!');
      }
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
      // Fallback extremo
      prompt('Copie o conteúdo:', shareContent.text);
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(getShareText());
    const whatsappUrl = `https://wa.me/?text=${text}`;
    
    // Tenta abrir no app nativo ou no navegador
    if (window.Capacitor?.isNative) {
      window.Capacitor.Plugins.Browser.open({ url: whatsappUrl });
    } else {
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-shadow duration-300">
        {imageUrl && (
          <div className="w-full h-64 overflow-hidden">
            <img
              src={imageUrl}
              alt={`Imagem de ${title}`}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <CardHeader className="pb-4 bg-gradient-to-r from-green-500 to-teal-600 text-white">
          <CardTitle className="text-3xl font-bold">{title}</CardTitle>
          {description && (
            <CardDescription className="text-green-100 mt-1">{description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {prepTime && (
              <div className="flex items-center p-3 bg-green-50 rounded-lg">
                <Clock className="h-5 w-5 mr-2 text-green-600" />
                <span className="font-semibold">Tempo de Preparo:</span> {prepTime}
              </div>
            )}
            {difficulty && (
              <div className="flex items-center p-3 bg-teal-50 rounded-lg">
                <BarChart3 className="h-5 w-5 mr-2 text-teal-600" />
                <span className="font-semibold">Dificuldade:</span> {difficulty}
              </div>
            )}
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-3 flex items-center text-green-700">
              <Utensils className="h-5 w-5 mr-2" />
              Ingredientes
            </h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {ingredientsList.map((item, index) => (
                <li key={index} className="leading-relaxed">{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-3 flex items-center text-teal-700">
              <CheckSquare className="h-5 w-5 mr-2" />
              Modo de Preparo
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-gray-700">
              {instructions.map((step, index) => (
                <li key={index} className="leading-relaxed">{step}</li>
              ))}
            </ol>
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

export default RecipeDisplay;
