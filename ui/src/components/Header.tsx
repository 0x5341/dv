import { buttonVariants } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface HeaderProps {
  vibeKanbanUrl: string
}

export function Header({ vibeKanbanUrl }: HeaderProps) {
  return (
    <div className="flex flex-col items-center gap-6 text-center relative">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">DV</h1>
      <p className="text-muted-foreground max-w-2xl">Manage Dev Environment & Launch Web Apps</p>
      {vibeKanbanUrl && (
        <a
          href={vibeKanbanUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "default" }),
            "flex items-center gap-2 absolute top-0 right-0"
          )}
        >
          VIBE-KANBAN
          <ExternalLink className="h-4 w-4" />
        </a>
      )}
    </div>
  )
}
