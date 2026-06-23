import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Features } from './components/Features'
import { VisualizationSection } from './components/VisualizationSection'
import { AuthShowcase } from './components/AuthShowcase'
import { CTASection } from './components/CTASection'
import { Footer } from './components/Footer'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashboardPage'
import { StoriesPage } from './pages/StoriesPage'
import { StoryDetailPage } from './pages/StoryDetailPage'
import { AppLayout } from './layouts/AppLayout'
import { useAuthStore } from './lib/authStore'

function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-base selection:bg-violet-500 selection:text-white dark:bg-zinc-950 transition-colors duration-300">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <VisualizationSection />
        <AuthShowcase />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  const { checkAuth } = useAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="stories" element={<StoriesPage />} />
          <Route path="stories/:storyId" element={<StoryDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
