import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { createApiClient } from '@omnistack/api-client'
import { Button } from '~/components/ui/button'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const serverUrl = import.meta.env.VITE_SERVER_URL ?? 'http://localhost:3001'
  const api = useMemo(
    () => createApiClient(serverUrl),
    [serverUrl],
  )
  const [health, setHealth] = useState<string>('loading...')
  const [hello, setHello] = useState<string>('')
  const [loadingHello, setLoadingHello] = useState(false)

  useEffect(() => {
    api.health().then((res) => {
      setHealth(`${res.status} @ ${res.timestamp}`)
    })
  }, [api])

  async function callHello() {
    setLoadingHello(true)
    try {
      const response = await api.hello({ name: 'OmniStack' })
      setHello(response.message)
    } finally {
      setLoadingHello(false)
    }
  }

  function signInWithGitHub() {
    const target = new URL('/api/auth/sign-in/social', serverUrl)
    target.searchParams.set('provider', 'github')
    target.searchParams.set('callbackURL', window.location.href)
    window.location.href = target.toString()
  }

  function signInWithGoogle() {
    const target = new URL('/api/auth/sign-in/social', serverUrl)
    target.searchParams.set('provider', 'google')
    target.searchParams.set('callbackURL', window.location.href)
    window.location.href = target.toString()
  }

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-semibold">OmniStack React 19 + TanStack Start</h1>
      <p className="text-slate-600">Monorepo web app scaffold with Cloudflare-ready SSR.</p>
      <p className="text-sm text-slate-600">oRPC health: {health}</p>
      <div className="flex flex-wrap gap-3">
        <Button onClick={callHello} disabled={loadingHello}>
          {loadingHello ? 'Calling...' : 'Call oRPC hello'}
        </Button>
        <Button variant="outline" onClick={signInWithGitHub}>
          Sign in with GitHub
        </Button>
        <Button variant="outline" onClick={signInWithGoogle}>
          Sign in with Google
        </Button>
      </div>
      {hello ? <p className="text-sm text-slate-700">{hello}</p> : null}
    </section>
  )
}
