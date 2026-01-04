import { useEffect, useState, useMemo } from 'react'
import Fuse from 'fuse.js'
import './App.css'
import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { buttonVariants } from "@/components/ui/button"
import { Github, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface Repo {
  name: string
  fullPath: string
}

interface CodeConfig {
  url: string
  token: string
}

interface VibeKanbanConfig {
  url: string
}

function App() {
  const [repos, setRepos] = useState<Repo[]>([])
  const [codeConfig, setCodeConfig] = useState<CodeConfig>({ url: '', token: '' })
  const [vibeKanbanConfig, setVibeKanbanConfig] = useState<VibeKanbanConfig>({ url: '' })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    Promise.all([
      fetch('/api/repos').then(res => res.json()),
      fetch('/api/code').then(res => res.json()),
      fetch('/api/vibe-kanban').then(res => res.json())
    ])
      .then(([reposData, configData, vibeKanbanData]) => {
        setRepos(reposData || [])
        setCodeConfig(configData)
        setVibeKanbanConfig(vibeKanbanData)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setLoading(false)
      })
  }, [])

  const fuse = useMemo(() => {
    return new Fuse(repos, {
      keys: ['name', 'fullPath'],
      threshold: 0.4, // Adjust for fuzziness sensitivity
    })
  }, [repos])

  const filteredRepos = useMemo(() => {
    if (!search) return repos
    return fuse.search(search).map(result => result.item)
  }, [repos, search, fuse])

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

  return (
    <div className="container mx-auto p-8 min-h-screen space-y-8">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-4 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">GHQ MANAGER</h1>
          <p className="text-muted-foreground">Manage and open your local repositories in Code Server.</p>
        </div>
        {vibeKanbanConfig.url && (
          <a
            href={vibeKanbanConfig.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "default" }),
              "flex items-center gap-2"
            )}
          >
            VIBE-KANBAN
            <ExternalLink className="h-4 w-4" />
          </a>
        )}
      </div>

      <div className="max-w-md mx-auto">
        <Input
          type="text"
          placeholder="Search repositories (fuzzy)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full"
        />
      </div>

      {loading ? (
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
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 max-w-5xl mx-auto">
          {filteredRepos.map((repo) => {
            const githubUrl = getGithubUrl(repo.name)
            return (
              <Card
                key={repo.fullPath}
                className="group relative h-26 py-0 flex flex-col transition-all hover:shadow-md overflow-hidden"
              >
                {/* Full card clickable area using <a> */}
                <a
                  href={getRepoUrl(repo)}
                  className="absolute inset-0 z-0 hover:bg-accent/50 transition-colors"
                />

                <CardHeader className="w-full text-left z-10 pointer-events-none flex-grow p-4">
                  <CardTitle className="text-lg pr-6 break-all line-clamp-2" title={repo.fullPath}>
                    {getDisplayName(repo.name)}
                  </CardTitle>
                </CardHeader>

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
            )
          })}
          {filteredRepos.length === 0 && (
            <div className="col-span-full text-center text-muted-foreground py-10">
              No repositories found matching "{search}"
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App
