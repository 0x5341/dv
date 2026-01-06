import { useState } from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { Github, MoreVertical, Trash } from "lucide-react"
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
import type { Repo, CodeConfig } from "@/types"

interface RepoCardProps {
  repo: Repo
  codeConfig: CodeConfig
  onRepoDeleted: () => void
}

export function RepoCard({ repo, codeConfig, onRepoDeleted }: RepoCardProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the repository
              <span className="font-mono text-xs block mt-2 bg-muted p-1 rounded">
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
