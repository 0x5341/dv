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
import { Github } from "lucide-react"
import { cn } from "@/lib/utils"

interface Repo {
  name: string
  fullPath: string
}

function App() {
  const [repos, setRepos] = useState<Repo[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/repos')
      .then(res => res.json())
      .then(data => {
        setRepos(data || [])
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
    const codeServerUrl = import.meta.env.VITE_CODE_SERVER_URL || 'http://localhost:8000'
    const token = import.meta.env.VITE_CODE_SERVER_TOKEN
    
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
      <div className="flex flex-col gap-4 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">GHQ Manager</h1>
        <p className="text-muted-foreground">Manage and open your local repositories in Code Server.</p>
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
             <Card key={i} className="h-26">
                <CardHeader className="p-3">
                    <Skeleton className="h-5 w-3/4 mb-2" />
                    <Skeleton className="h-3 w-full" />
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
                className="group relative h-26 flex flex-col transition-all hover:shadow-md overflow-hidden"
              >
                {/* Full card clickable area using <a> */}
                <a 
                   href={getRepoUrl(repo)}
                   className="absolute inset-0 z-0 hover:bg-accent/50 transition-colors"
                />

                <CardHeader className="w-full text-left z-10 pointer-events-none flex-grow p-4">
                  <CardTitle className="truncate text-lg pr-6" title={repo.fullPath}>
                      {getDisplayName(repo.name)}
                  </CardTitle>
                </CardHeader>
                
                {githubUrl && (
                  <div className="absolute bottom-1 right-1 z-20">
                    <a
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "h-7 w-7"
                      )}
                      title="Open on GitHub"
                    >
                      <Github className="h-3.5 w-3.5" />
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