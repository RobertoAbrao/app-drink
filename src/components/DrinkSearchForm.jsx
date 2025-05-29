// src/components/DrinkSearchForm.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button'; //
import { Input } from '@/components/ui/input'; //
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'; //
import { useToast } from '@/components/ui/use-toast'; //
import { GlassWater, Loader2, Plus, X, Edit, RefreshCw, Sparkles, Check } from 'lucide-react';
import { getAllIngredients, getPopularIngredients } from '@/lib/ingredientUtils'; // Importando as novas funções

const DrinkSearchForm = ({ onSearch, isLoading, drinkIngredients, setDrinkIngredients }) => {
  const { toast } = useToast();
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [allPossibleIngredients, setAllPossibleIngredients] = useState([]);
  const [popularIngredientsList, setPopularIngredientsList] = useState([]);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState([]);
  const [editingIngredient, setEditingIngredient] = useState(null); // Guarda o ingrediente original que está sendo editado
  const [editingIndex, setEditingIndex] = useState(-1); // Guarda o índice do ingrediente que está sendo editado

  useEffect(() => {
    setAllPossibleIngredients(getAllIngredients());
    setPopularIngredientsList(getPopularIngredients(8)); // Pega os 8 mais populares
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCurrentIngredient(value);
    if (value.length > 1) {
      const filtered = allPossibleIngredients.filter(
        ing => ing.toLowerCase().includes(value.toLowerCase()) && !drinkIngredients.includes(ing)
      );
      setAutocompleteSuggestions(filtered.slice(0, 5)); // Limita a 5 sugestões
    } else {
      setAutocompleteSuggestions([]);
    }
  };

  const addOrUpdateIngredient = () => {
    const ingredientToAdd = currentIngredient.trim();
    if (!ingredientToAdd) return;

    const ingredientExists = drinkIngredients.some(
      (ing, index) => ing.toLowerCase() === ingredientToAdd.toLowerCase() && index !== editingIndex
    );

    if (ingredientExists) {
      toast({
        title: "Ingrediente duplicado",
        description: "Este ingrediente já está na sua lista.",
        variant: "destructive",
      });
      return;
    }

    if (editingIndex !== -1) { // Modo de edição
      const updatedIngredients = [...drinkIngredients];
      updatedIngredients[editingIndex] = ingredientToAdd;
      setDrinkIngredients(updatedIngredients);
      setEditingIndex(-1);
      setEditingIngredient(null);
    } else { // Modo de adição
      setDrinkIngredients([...drinkIngredients, ingredientToAdd]);
    }
    setCurrentIngredient('');
    setAutocompleteSuggestions([]);
  };

  const handleAddOrUpdateClick = () => {
    addOrUpdateIngredient();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Evita submit do formulário se houver
      addOrUpdateIngredient();
    }
  };
  
  const selectSuggestion = (suggestion) => {
    setCurrentIngredient(suggestion); // Preenche o input
    setAutocompleteSuggestions([]);
    // Focamos no botão de adicionar/atualizar ou no próprio input para o usuário pressionar Enter ou clicar
    // Adicionamos diretamente o ingrediente ao invés de apenas preencher o campo:
    if (editingIndex !== -1) {
        const updatedIngredients = [...drinkIngredients];
        updatedIngredients[editingIndex] = suggestion;
        setDrinkIngredients(updatedIngredients);
        setEditingIndex(-1);
        setEditingIngredient(null);
    } else if (!drinkIngredients.includes(suggestion)) {
        setDrinkIngredients([...drinkIngredients, suggestion]);
    } else {
        toast({
            title: "Ingrediente duplicado",
            description: "Este ingrediente já está na sua lista.",
            variant: "destructive",
        });
    }
    setCurrentIngredient(''); // Limpa o input após adicionar
  };

  const addPopularIngredient = (popularIng) => {
    if (!drinkIngredients.includes(popularIng)) {
      setDrinkIngredients([...drinkIngredients, popularIng]);
    } else {
      toast({
        title: "Ingrediente duplicado",
        description: "Este ingrediente já está na sua lista.",
        variant: "default",
      });
    }
  };

  const startEditIngredient = (ingredient, index) => {
    setEditingIngredient(ingredient);
    setEditingIndex(index);
    setCurrentIngredient(ingredient); // Coloca o ingrediente no input para edição
    // Idealmente, focar no input aqui
    // inputRef.current?.focus(); // Se você adicionar um ref ao input
  };

  const cancelEdit = () => {
    setEditingIngredient(null);
    setEditingIndex(-1);
    setCurrentIngredient('');
    setAutocompleteSuggestions([]);
  };

  const removeIngredient = (indexToRemove) => {
    setDrinkIngredients(drinkIngredients.filter((_, index) => index !== indexToRemove));
    if (indexToRemove === editingIndex) { // Cancela edição se o item editado for removido
        cancelEdit();
    }
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
      <CardContent className="space-y-6">
        {/* Input e Botão Adicionar/Atualizar */}
        <div className="flex flex-col sm:flex-row gap-2 items-start">
          <div className="relative w-full sm:flex-grow">
            <Input
              placeholder="Ex: Vodka, Limão, Açúcar..."
              value={currentIngredient}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="flex-grow"
            />
            {autocompleteSuggestions.length > 0 && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-40 overflow-y-auto">
                {autocompleteSuggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    onClick={() => selectSuggestion(suggestion)}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {suggestion}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex gap-2 mt-2 sm:mt-0">
            <Button
              onClick={handleAddOrUpdateClick}
              type="button"
              variant={editingIndex !== -1 ? "default" : "outline"}
              className="min-w-[120px]"
              disabled={!currentIngredient.trim()}
            >
              {editingIndex !== -1 ? <Check className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
              {editingIndex !== -1 ? 'Atualizar' : 'Adicionar'}
            </Button>
            {editingIndex !== -1 && (
              <Button
                onClick={cancelEdit}
                type="button"
                variant="ghost"
                size="icon"
                title="Cancelar Edição"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Ingredientes Populares */}
        {popularIngredientsList.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 text-muted-foreground flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-yellow-500" />
                Sugestões Populares:
            </h4>
            <div className="flex flex-wrap gap-2">
              {popularIngredientsList.map((popIng, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => addPopularIngredient(popIng)}
                  className="bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-300"
                >
                  {popIng}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        {/* Lista de Ingredientes Adicionados */}
        {drinkIngredients.length > 0 && (
          <div>
             <h4 className="text-sm font-medium mb-2 text-muted-foreground">Seus Ingredientes:</h4>
            <div className="flex flex-wrap gap-2">
              {drinkIngredients.map((ingredient, index) => (
                <div
                  key={index}
                  className={`bg-primary/10 text-primary rounded-full px-3 py-1.5 flex items-center gap-2 text-sm transition-all duration-200 ${index === editingIndex ? 'ring-2 ring-indigo-500 shadow-lg' : ''}`}
                >
                  <span>{ingredient}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => startEditIngredient(ingredient, index)}
                      className="text-primary/70 hover:text-primary disabled:opacity-50"
                      title="Editar ingrediente"
                      disabled={editingIndex !== -1 && editingIndex !== index} // Desabilita outros botões de editar durante uma edição
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeIngredient(index)}
                      className="text-red-500/70 hover:text-red-500"
                      title="Remover ingrediente"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
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