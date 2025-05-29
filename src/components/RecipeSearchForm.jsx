import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Loader2 } from 'lucide-react';

const RecipeSearchForm = ({ onSearch, isLoading, query, setQuery }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
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
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Ex: Mojito, Caipirinha, Cosmopolitan..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-grow"
            disabled={isLoading}
          />
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
      </CardContent>
    </Card>
  );
};

export default RecipeSearchForm;