import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SearchBar = ({ value, onChange, onSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Buscar por título, autor ou categoria..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12"
        />
        <Button
          type="submit"
          variant="outline"
          aria-label="Submit"
          className="h-12"
        >
          <Search />
          Buscar
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
