// src/components/RecipeSearchForm.jsx
import React, { useState, useEffect } from 'react'; // Adicionado useState e useEffect
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Loader2, Zap } from 'lucide-react'; // Adicionado Zap para sugestões populares
import { getAllDrinkNames } from '@/lib/ingredientUtils'; // Importando a nova função

// (Opcional) Você pode definir alguns drinks populares manualmente ou criar uma lógica para isso
const popularDrinkSuggestions = ["Caipirinha", "Mojito", "Negroni", "Margarita", "Dry Martini"];

const RecipeSearchForm = ({ onSearch, isLoading, query, setQuery }) => {
  const [allDrinkNames, setAllDrinkNames] = useState([]);
  const [nameSuggestions, setNameSuggestions] = useState([]);

  useEffect(() => {
    setAllDrinkNames(getAllDrinkNames());
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value); // Atualiza o estado query que vem das props

    if (value.length > 1) {
      const filtered = allDrinkNames.filter(
        name => name.toLowerCase().includes(value.toLowerCase())
      );
      setNameSuggestions(filtered.slice(0, 5)); // Limita a 5 sugestões
    } else {
      setNameSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion); // Define o valor do input para a sugestão
    setNameSuggestions([]); // Limpa as sugestões
    // Opcional: submeter a busca automaticamente ao clicar na sugestão
    // onSearch(suggestion);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setNameSuggestions([]); // Limpa sugestões ao submeter
    onSearch(query);
  };

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Buscar Receita de Drink</CardTitle>
        <CardDescription>
          Digite o nome do drink que você deseja e a IA trará a receita completa.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="relative">
            <Input
              placeholder="Ex: Mojito, Caipirinha, Cosmopolitan..."
              value={query}
              onChange={handleInputChange} // Modificado para usar handleInputChange
              className="flex-grow"
              disabled={isLoading}
            />
            {nameSuggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto">
                {nameSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <Button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="min-w-[120px] bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            Buscar
          </Button>
        </form>
        
        {/* Sugestões Populares de Drinks */}
        <div>
            <h4 className="text-sm font-medium mb-2 text-muted-foreground flex items-center">
                <Zap className="h-4 w-4 mr-2 text-purple-500" />
                Experimente buscar por:
            </h4>
            <div className="flex flex-wrap gap-2">
              {popularDrinkSuggestions.map((drinkName, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestionClick(drinkName)}
                  className="bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-300"
                >
                  {drinkName}
                </Button>
              ))}
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecipeSearchForm;