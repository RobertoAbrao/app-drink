import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { GlassWater, Loader2, Plus, X } from 'lucide-react';

const DrinkSearchForm = ({ onSearch, isLoading, drinkIngredients, setDrinkIngredients }) => {
  const { toast } = useToast();
  const [currentIngredient, setCurrentIngredient] = useState('');

  const addIngredient = () => {
    if (!currentIngredient.trim()) return;
    
    if (!drinkIngredients.includes(currentIngredient.trim())) {
      setDrinkIngredients([...drinkIngredients, currentIngredient.trim()]);
      setCurrentIngredient('');
    } else {
      toast({
        title: "Ingrediente duplicado",
        description: "Este ingrediente já está na sua lista.",
        variant: "destructive",
      });
    }
  };

  const removeIngredient = (ingredient) => {
    setDrinkIngredients(drinkIngredients.filter(item => item !== ingredient));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(drinkIngredients);
  };

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Encontre Drinks</CardTitle>
        <CardDescription>
          Adicione os ingredientes que você tem em casa e a IA irá sugerir drinks que você pode fazer.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Ex: vodka, limão, açúcar..."
            value={currentIngredient}
            onChange={(e) => setCurrentIngredient(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addIngredient()}
            className="flex-grow"
          />
          <Button 
            onClick={addIngredient}
            type="button"
            variant="outline"
            className="min-w-[120px]"
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar
          </Button>
        </div>
        
        {drinkIngredients.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {drinkIngredients.map((ingredient, index) => (
              <div 
                key={index}
                className="bg-primary/10 text-primary rounded-full px-3 py-1 flex items-center gap-1"
              >
                <span>{ingredient}</span>
                <button 
                  onClick={() => removeIngredient(ingredient)}
                  className="text-primary/70 hover:text-primary"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="pt-4">
          <Button 
            type="submit" 
            disabled={isLoading || drinkIngredients.length === 0}
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <GlassWater className="h-4 w-4 mr-2" />
            )}
            Encontrar Drinks
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default DrinkSearchForm;