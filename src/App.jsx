import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { GlassWater, Loader2, Plus, X, Search, Utensils } from 'lucide-react';
import DrinkCard from '@/components/DrinkCard.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { generateDrink, generateRecipe } from '@/lib/openai.js';
import DrinkSearchForm from '@/components/DrinkSearchForm.jsx';
import DrinkList from '@/components/DrinkList.jsx';
import RecipeSearchForm from '@/components/RecipeSearchForm.jsx';
import RecipeDisplay from '@/components/RecipeDisplay.jsx';

function App() {
  const { toast } = useToast();
  const [drinkIngredients, setDrinkIngredients] = useState([]);
  const [drinks, setDrinks] = useState([]);
  const [isLoadingDrink, setIsLoadingDrink] = useState(false);
  const [activeTab, setActiveTab] = useState("findDrinks");

  const [recipeQuery, setRecipeQuery] = useState('');
  const [recipe, setRecipe] = useState(null);
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);


  const handleDrinkSearchByIngredients = async (ingredients) => {
    if (ingredients.length === 0) {
      toast({
        title: "Sem ingredientes",
        description: "Por favor, adicione pelo menos um ingrediente.",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingDrink(true);
    
    try {
      const drink = await generateDrink(ingredients);
      setDrinks([drink, ...drinks]);
      toast({
        title: "Drink encontrado!",
        description: "Seu drink foi gerado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao gerar drink por ingredientes:", error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar o drink. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingDrink(false);
    }
  };

  const handleRecipeSearchByName = async (drinkName) => {
    if (!drinkName.trim()) {
      toast({
        title: "Nome do drink vazio",
        description: "Por favor, digite o nome do drink que deseja buscar.",
        variant: "destructive",
      });
      return;
    }
    setIsLoadingRecipe(true);
    setRecipe(null);
    try {
      const recipeData = await generateRecipe(drinkName);
      setRecipe(recipeData);
      toast({
        title: "Receita encontrada!",
        description: `A receita para ${drinkName} foi carregada.`,
      });
    } catch (error) {
      console.error("Erro ao buscar receita do drink:", error);
      toast({
        title: "Erro",
        description: "Não foi possível buscar a receita do drink. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingRecipe(false);
    }
  };


  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-purple-100">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
       <TabsList
        className="inline-flex items-center justify-center w-fit mx-auto gap-1 bg-white dark:bg-zinc-800 rounded-lg p-1 shadow-inner"
      >
        <TabsTrigger
          value="findDrinks"
          className="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:text-gray-700 dark:data-[state=inactive]:text-gray-300"
        >
          <GlassWater className="h-4 w-4 mr-2" />
          Ingredientes
        </TabsTrigger>
        
        <TabsTrigger
          value="searchRecipe"
          className="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=inactive]:text-gray-700 dark:data-[state=inactive]:text-gray-300"
        >
          <Search className="h-4 w-4 mr-2" />
          Receita
        </TabsTrigger>
      </TabsList>



          <TabsContent value="findDrinks">
            <motion.div
              key="findDrinks"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <DrinkSearchForm 
                onSearch={handleDrinkSearchByIngredients} 
                isLoading={isLoadingDrink}
                drinkIngredients={drinkIngredients}
                setDrinkIngredients={setDrinkIngredients}
              />
              <DrinkList drinks={drinks} />
            </motion.div>
          </TabsContent>

          <TabsContent value="searchRecipe">
            <motion.div
              key="searchRecipe"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              <RecipeSearchForm
                onSearch={handleRecipeSearchByName}
                isLoading={isLoadingRecipe}
                query={recipeQuery}
                setQuery={setRecipeQuery}
              />
              {isLoadingRecipe && (
                <div className="flex justify-center items-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="ml-2 text-muted-foreground">Buscando receita...</p>
                </div>
              )}
              {recipe && !isLoadingRecipe && <RecipeDisplay recipe={recipe} />}
               {!recipe && !isLoadingRecipe && (
                 <div className="text-center py-10 text-muted-foreground">
                   <Utensils className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                   <p>Digite o nome de um drink para ver a receita aqui.</p>
                 </div>
               )}
            </motion.div>
          </TabsContent>
        </Tabs>
      </main>
      
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;