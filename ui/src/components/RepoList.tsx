import { Card, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { RepoCard } from "./RepoCard"
import type { Repo, CodeConfig } from "@/types"

interface RepoListProps {
  loading: boolean
  filteredRepos: Repo[]
  search: string
  codeConfig: CodeConfig
  onRepoDeleted: () => void
}

export function RepoList({ loading, filteredRepos, search, codeConfig, onRepoDeleted }: RepoListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 max-w-5xl mx-auto">
        {Array.from({ length: 15 }).map((_, i) => (
          <Card key={i} className="h-26 py-0">
            <CardHeader className="p-4">
              <Skeleton className="h-5 w-3/4 mb-1" />
              <Skeleton className="h-3 w-1/2" />
            </CardHeader>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 max-w-5xl mx-auto">
      {filteredRepos.map((repo) => (
        <RepoCard 
          key={repo.fullPath} 
          repo={repo} 
          codeConfig={codeConfig} 
          onRepoDeleted={onRepoDeleted}
        />
      ))}
      {filteredRepos.length === 0 && (
        <div className="col-span-full text-center text-muted-foreground py-10">
          No repositories found matching "{search}"
        </div>
      )}
    </div>
  )
}
