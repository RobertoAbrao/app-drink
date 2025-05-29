import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GlassWater, Droplets, ThumbsUp, Share2, MessageSquare } from 'lucide-react';

const DrinkCard = ({ drink }) => {
  const { name, description, ingredients, instructions, alcoholContent, difficulty } = drink;

  // Função para gerar o texto formatado para compartilhamento
  const getShareText = () => {
    return `🍹 *${name}*\n\n${description}\n\n🥃 *Ingredientes:*\n- ${ingredients.join('\n- ')}\n\n🔧 *Modo de Preparo:*\n${instructions.map((s, i) => `${i + 1}. ${s}`).join('\n')}`;
  };

  // Compartilhamento genérico
  const handleShare = async () => {
    const shareContent = {
      title: name,
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

  // Compartilhamento específico para WhatsApp
  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(getShareText());
    const whatsappUrl = `https://wa.me/?text=${text}`;
    
    // Tenta abrir no app nativo ou no navegador
    if (window.Capacitor?.isNative) {
      window.Capacitor.Plugins.Browser.open({ 
        url: whatsappUrl,
        windowName: '_system'
      });
    } else {
      window.open(whatsappUrl, '_blank');
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className="h-full overflow-hidden recipe-card border-none shadow-md hover:shadow-xl">
        <CardHeader className="pb-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardTitle className="text-xl">{name}</CardTitle>
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center text-white/90 text-sm">
              <Droplets className="h-4 w-4 mr-1" />
              <span>{alcoholContent}</span>
            </div>
            <div className="flex items-center text-white/90 text-sm">
              <ThumbsUp className="h-4 w-4 mr-1" />
              <span>{difficulty}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          <CardDescription className="text-sm mb-4">{description}</CardDescription>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-sm mb-2 flex items-center">
                <Droplets className="h-4 w-4 mr-2 text-blue-500" />
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
                <GlassWater className="h-4 w-4 mr-2 text-blue-500" />
                Modo de Preparo
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
        <CardFooter className="pt-2 flex gap-2">
          <Button variant="outline" className="flex-1" onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Compartilhar
          </Button>
          
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default DrinkCard;