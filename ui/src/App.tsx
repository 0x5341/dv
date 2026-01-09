import { useEffect, useState, useMemo, useCallback } from 'react'
import Fuse from 'fuse.js'
import './App.css'
import { Header } from "@/components/Header"
import { SearchBar } from "@/components/SearchBar"
import { RepoList } from "@/components/RepoList"
import { AddRepoDialog } from "@/components/AddRepoDialog"
import type { Repo, CodeConfig, OpenLink } from "@/types"

function App() {
  const [repos, setRepos] = useState<Repo[]>([])
  const [codeConfig, setCodeConfig] = useState<CodeConfig>({ url: '', token: '' })
  const [openLinks, setOpenLinks] = useState<OpenLink[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchRepos = useCallback(() => {
    fetch('/api/repos')
      .then(res => res.json())
      .then(data => setRepos(data || []))
      .catch(console.error)
  }, [])

  useEffect(() => {
    Promise.all([
      fetch('/api/repos').then(res => res.json()),
      fetch('/api/code').then(res => res.json()),
      fetch('/api/open-link-button').then(res => res.json())
    ])
      .then(([reposData, configData, openLinksData]) => {
        setRepos(reposData || [])
        setCodeConfig(configData)
        setOpenLinks(openLinksData || [])
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

  return (
    <div className="container mx-auto p-8 min-h-screen space-y-8">
      <Header openLinks={openLinks} />
      <div className="flex justify-center gap-4 max-w-xl mx-auto w-full">
        <div className="flex-1">
          <SearchBar search={search} setSearch={setSearch} />
        </div>
        <AddRepoDialog onRepoAdded={fetchRepos} />
      </div>
      <RepoList 
        loading={loading} 
        filteredRepos={filteredRepos} 
        search={search} 
        codeConfig={codeConfig}
        onRepoDeleted={fetchRepos}
      />
    </div>
  )
}

export default App