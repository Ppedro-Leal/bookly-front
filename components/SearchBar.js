import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const SearchBar = ({ value, onChange, onSearch }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch();
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div
        className="flex h-[60px] max-w-2xl mx-auto rounded-[40px] overflow-hidden shadow-2xl"
        style={{
          boxShadow:
            "0 8px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Input
          type="text"
          placeholder="Pesquisar por título, autor ou categoria..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="
            flex-1 h-full 
            bg-[#FFFFE3] 
            border-none 
            focus-visible:ring-0 
            focus-visible:ring-offset-0 
            rounded-none 
            text-lg 
            placeholder:text-[#999999] 
            px-6
          "
        />
        <Button
          type="submit"
          aria-label="Submit"
          className="
            h-full w-[60px] 
            bg-[#AF7026] 
            hover:bg-[#9A6020] 
            rounded-none 
            flex items-center justify-center
            p-0
          "
        >
          <Search className="h-5 w-5 text-white" />
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
