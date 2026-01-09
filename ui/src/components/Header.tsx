import { buttonVariants } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

interface HeaderProps {
  openLinks: OpenLink[]
}

export function Header({ openLinks }: HeaderProps) {
  return (
    <div className="flex flex-col items-center gap-6 text-center relative">
      <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">DV</h1>
      <p className="text-muted-foreground max-w-2xl">Manage Dev Environment & Launch Web Apps</p>
      <div className="absolute top-0 right-0 flex items-center gap-2">
        {openLinks.map(link => (
          <a
            key={link.name}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "default" }),
              "flex items-center gap-2"
            )}
          >
            {link.name}
            <ExternalLink className="h-4 w-4" />
          </a>
        ))}
      </div>
    </div>
  )
}
