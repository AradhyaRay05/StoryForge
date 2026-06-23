import { ScrollReveal } from './ScrollReveal'

const footerLinks = {
  Product: ['Features', 'Visualizations', 'World Building', 'Pricing', 'API'],
  Company: ['About', 'Blog', 'Careers', 'Press'],
  Resources: ['Documentation', 'Tutorials', 'Community', 'Templates'],
  Legal: ['Privacy', 'Terms', 'Security', 'Cookies'],
}

export function Footer() {
  return (
    <footer id="footer" className="bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10 lg:gap-8 mb-16">
          <div className="col-span-2 md:col-span-1">
            <ScrollReveal>
              <div className="flex items-center gap-2.5 mb-4">
                <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="4" width="20" height="24" rx="3" stroke="#8b5cf6" strokeWidth="2" />
                  <rect x="10" y="8" width="20" height="24" rx="3" fill="#8b5cf6" fillOpacity="0.15" stroke="#a78bfa" strokeWidth="2" />
                  <circle cx="15" cy="16" r="2" fill="#8b5cf6" />
                  <circle cx="22" cy="14" r="1.5" fill="#d946ef" />
                  <circle cx="19" cy="22" r="1.5" fill="#d946ef" />
                  <line x1="15" y1="16" x2="22" y2="14" stroke="#a78bfa" strokeWidth="1.2" />
                  <line x1="15" y1="16" x2="19" y2="22" stroke="#a78bfa" strokeWidth="1.2" />
                  <line x1="22" y1="14" x2="19" y2="22" stroke="#e879f9" strokeWidth="1.2" />
                </svg>
                <span className="font-display font-semibold tracking-tight text-lg text-white">StoryForge</span>
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Build worlds. Track stories. Create legends.
              </p>
            </ScrollReveal>
          </div>

          {Object.entries(footerLinks).map(([category, links], i) => (
            <ScrollReveal key={category} delay={0.1 * (i + 1)}>
              <div>
                <h4 className="font-display text-sm font-semibold text-zinc-300 mb-4">{category}</h4>
                <ul className="space-y-2.5">
                  {links.map(link => (
                    <li key={link}>
                      <a href="#" className="text-sm text-zinc-500 hover:text-violet-400 transition-colors duration-200">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <div className="border-t border-zinc-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-600">&copy; {new Date().getFullYear()} StoryForge. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <a href="#" className="text-zinc-600 hover:text-violet-400 transition-colors" aria-label="Twitter">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
            </a>
            <a href="#" className="text-zinc-600 hover:text-violet-400 transition-colors" aria-label="GitHub">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
            </a>
            <a href="#" className="text-zinc-600 hover:text-violet-400 transition-colors" aria-label="Discord">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z" /></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
