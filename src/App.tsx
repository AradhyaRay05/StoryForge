import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Features } from './components/Features'
import { VisualizationSection } from './components/VisualizationSection'
import { AuthShowcase } from './components/AuthShowcase'
import { CTASection } from './components/CTASection'
import { Footer } from './components/Footer'

export default function App() {
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
