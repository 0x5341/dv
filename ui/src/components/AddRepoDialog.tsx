import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus } from "lucide-react"

interface AddRepoDialogProps {
  onRepoAdded: () => void
}

export function AddRepoDialog({ onRepoAdded }: AddRepoDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [isLocal, setIsLocal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const endpoint = isLocal ? "/api/create" : "/api/get"
      const body = isLocal ? { name: input } : { url: input }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        const text = await res.text()
        throw new Error(text || "Failed to add repository")
      }

      setInput("")
      setIsLocal(false)
      setIsOpen(false)
      onRepoAdded()
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An unknown error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)} className="gap-2">
        <Plus className="h-4 w-4" />
        Add
      </Button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Add Repository</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  {isLocal ? "Repository Name" : "Repository URL"}
                </label>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={isLocal ? "my-new-project" : "https://github.com/user/repo"}
                  disabled={loading}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="local-mode"
                  checked={isLocal}
                  onChange={(e) => setIsLocal(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300"
                  disabled={loading}
                />
                <label htmlFor="local-mode" className="text-sm">
                  Just create in local
                </label>
              </div>

              {error && (
                <div className="text-sm text-red-500">{error}</div>
              )}

              <div className="flex justify-end gap-2 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading || !input.trim()}>
                  {loading ? "Processing..." : (isLocal ? "Create" : "Clone")}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
