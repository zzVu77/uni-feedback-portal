"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Input } from "../ui/input";
import { Search } from "lucide-react";

const SearchBar = ({ placeholder }: { placeholder: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const handleSearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    if (query) {
      params.set("q", query.toLowerCase());
      params.set("page", "1");
    } else {
      params.delete("q");
      params.delete("page");
    }
    router.replace(`?${params.toString()}`);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };
  // const handleButtonClick = () => {
  //   handleSearch();
  // };

  return (
    <div className="flex w-full flex-row items-center justify-start gap-1">
      <div className="relative h-auto w-full">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          type="text"
          placeholder={placeholder ?? "Tìm kiếm..."}
          className="bg-background w-full rounded-lg pl-10 shadow-sm"
        />
      </div>
      {/* <Button
        className="h-10 cursor-pointer rounded-lg bg-green-500 text-center hover:bg-green-500/70 active:scale-95"
        onClick={handleButtonClick}
      >
        <Search className="pointer-events-none h-4 w-4 text-white" />
      </Button> */}
    </div>
  );
};

export default SearchBar;
