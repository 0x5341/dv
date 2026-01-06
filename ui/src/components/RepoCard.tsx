import { useState, useEffect } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { Github, MoreVertical, Trash, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Repo, CodeConfig, RepoStatus } from "@/types"

interface RepoCardProps {
  repo: Repo
  codeConfig: CodeConfig
  onRepoDeleted: () => void
}

export function RepoCard({ repo, codeConfig, onRepoDeleted }: RepoCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [repoStatus, setRepoStatus] = useState<RepoStatus | null>(null)
  const [isLoadingStatus, setIsLoadingStatus] = useState(false)

  useEffect(() => {
    if (deleteDialogOpen) {
      setIsLoadingStatus(true)
      setRepoStatus(null)
      fetch(`/api/repo/status?path=${encodeURIComponent(repo.fullPath)}`)
        .then(res => res.json())
        .then((data: RepoStatus) => {
          setRepoStatus(data)
        })
        .catch(console.error)
        .finally(() => setIsLoadingStatus(false))
    }
  }, [deleteDialogOpen, repo.fullPath])

  const getRepoUrl = (repo: Repo) => {
    const codeServerUrl = codeConfig.url || 'http://localhost:8000'
    const token = codeConfig.token

    const url = new URL(codeServerUrl)
    url.searchParams.set('folder', repo.fullPath)
    if (token) {
      url.searchParams.set('tkn', token)
    }

    return url.toString()
  }

  const getDisplayName = (name: string) => {
    if (name.startsWith('github.com/')) {
      return name.slice(11)
    }
    return name
  }

  const getGithubUrl = (name: string) => {
    if (name.startsWith('github.com/')) {
      return `https://${name}`
    }
    return null
  }

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    try {
      const res = await fetch('/api/rm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: repo.fullPath }),
      })

      if (res.ok) {
        onRepoDeleted()
      } else {
        console.error("Failed to delete")
      }
    } catch (err) {
      console.error(err)
    } finally {
      setDeleteDialogOpen(false)
    }
  }

  const githubUrl = getGithubUrl(repo.name)

  const hasWarnings = repoStatus && (
    !repoStatus.is_clean || 
    repoStatus.has_unpushed_commits || 
    repoStatus.has_conflicts || 
    (repoStatus.unmerged_local_branches && repoStatus.unmerged_local_branches.length > 0)
  )

  return (
    <>
      <Card
        className="group relative h-26 py-0 flex flex-col transition-all hover:shadow-md overflow-hidden"
      >
        {/* Full card clickable area using <a> */}
        <a
          href={getRepoUrl(repo)}
          className="absolute inset-0 z-0 hover:bg-accent/50 transition-colors"
        />

        <CardHeader className="w-full text-left z-10 pointer-events-none flex-grow p-4">
          <CardTitle className="text-lg pr-8 break-all line-clamp-2" title={repo.fullPath}>
            {getDisplayName(repo.name)}
          </CardTitle>
        </CardHeader>

        {/* Top-right menu */}
        <div className="absolute top-2 right-2 z-30">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "h-8 w-8 data-[state=open]:bg-accent"
                )}
              >
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-destructive focus:text-destructive cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation()
                  setDeleteDialogOpen(true)
                }}
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Bottom-right GitHub button */}
        {githubUrl && (
          <div className="absolute bottom-2 right-2 z-20">
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon" }),
                "h-9 w-9"
              )}
              title="Open on GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        )}
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            {isLoadingStatus && (
              <div className="text-sm text-muted-foreground mb-4">Checking git status...</div>
            )}
            
            {!isLoadingStatus && hasWarnings && (
              <div className="bg-destructive/10 text-destructive p-4 pr-12 rounded-md mt-6 mb-4 text-sm border border-destructive/20 relative">
                <div className="flex items-center gap-2 font-bold mb-2">
                  <AlertTriangle className="h-4 w-4" />
                  Warning: Unsaved changes detected
                </div>
                <ul className="list-disc list-inside space-y-2">
                  {repoStatus.uncommitted_files && repoStatus.uncommitted_files.length > 0 && (
                    <li>
                      <span className="font-semibold">{repoStatus.uncommitted_files.length} uncommitted file(s)</span>
                      <ul className="pl-4 mt-1 list-none opacity-80 text-xs">
                        {repoStatus.uncommitted_files.slice(0, 5).map((f, i) => (
                          <li key={i} className="truncate">{f}</li>
                        ))}
                        {repoStatus.uncommitted_files.length > 5 && (
                          <li>...and {repoStatus.uncommitted_files.length - 5} more</li>
                        )}
                      </ul>
                    </li>
                  )}
                  {repoStatus.has_conflicts && (
                    <li className="font-semibold">Unmerged conflicts detected</li>
                  )}
                  {repoStatus.unmerged_local_branches && repoStatus.unmerged_local_branches.length > 0 && (
                    <li>
                      <span className="font-semibold">Unmerged local branches:</span>
                      <ul className="pl-4 list-disc mt-1 text-xs">
                        {repoStatus.unmerged_local_branches.map(b => (
                          <li key={b} className="font-mono">{b}</li>
                        ))}
                      </ul>
                    </li>
                  )}
                  {repoStatus.unpushed_commits && repoStatus.unpushed_commits.length > 0 && (
                    <li>
                      <span className="font-semibold">Unpushed commits:</span>
                      <ul className="pl-4 mt-1 space-y-2 text-xs">
                        {repoStatus.unpushed_commits.map(b => (
                          <li key={b.branch} className="list-none">
                            <div className="font-semibold mb-1">On branch {b.branch}:</div>
                            <ul className="pl-2 border-l-2 border-destructive/30 ml-1 space-y-1">
                              {b.commits.map(c => (
                                <li key={c.hash} className="font-mono flex gap-2">
                                  <span className="opacity-70">{c.hash.substring(0, 7)}</span>
                                  <span className="truncate">{c.message}</span>
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))}
                      </ul>
                    </li>
                  )}
                </ul>
                <p className="mt-3 font-semibold border-t border-destructive/20 pt-2">
                  These changes will be lost permanently if you delete this repository.
                </p>
              </div>
            )}

            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the repository
              <span className="font-mono text-xs block mt-2 bg-muted p-1 rounded break-all">
                {repo.fullPath}
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={(e) => {
              e.stopPropagation();
              setDeleteDialogOpen(false);
            }}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
