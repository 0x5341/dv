import { Input } from "@/components/ui/input"

interface SearchBarProps {
  search: string
  setSearch: (search: string) => void
}

export function SearchBar({ search, setSearch }: SearchBarProps) {
  return (
    <div className="w-full">
      <Input
        type="text"
        placeholder="Search repositories (fuzzy)..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full"
      />
    </div>
  )
}
