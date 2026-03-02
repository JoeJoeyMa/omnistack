import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">About</h1>
      <p className="text-slate-600">This template includes web, server, mobile, and shared packages.</p>
    </section>
  )
}