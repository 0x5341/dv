import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { Github } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Repo, CodeConfig } from "@/types"

interface RepoCardProps {
  repo: Repo
  codeConfig: CodeConfig
}

export function RepoCard({ repo, codeConfig }: RepoCardProps) {
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

  const githubUrl = getGithubUrl(repo.name)

  return (
    <Card
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
}
