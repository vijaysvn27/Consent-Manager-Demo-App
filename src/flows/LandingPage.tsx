import { useState } from 'react'
import { useDemo } from '../store/store'
import type { CompanyProfile, Industry } from '../store/types'
import CookieConsentModal from './CookieConsentModal'

// Industry-specific hero text
function getHeroConfig(industry: Industry, company: CompanyProfile) {
  switch (industry) {
    case 'telecom': return {
      hero: `Unlimited ${company.shortName} Plans`,
      subhero: 'Prepaid · Postpaid · Fiber · International',
      cta: 'Explore Plans',
      nav: ['Plans', 'Recharge', 'Devices', 'MyAccount', 'Support'],
    }
    case 'banking': return {
      hero: `Banking Made Simple`,
      subhero: 'Savings · Cards · Loans · Investments',
      cta: 'Open Account',
      nav: ['Accounts', 'Cards', 'Loans', 'Investments', 'NetBanking'],
    }
    case 'insurance': return {
      hero: `Protect What Matters Most`,
      subhero: 'Life · Health · Motor · Investment Plans',
      cta: 'Get a Quote',
      nav: ['Life', 'Health', 'Motor', 'Investment', 'Claims'],
    }
    case 'microfinance': return {
      hero: `Loans for a Better Tomorrow`,
      subhero: 'JLG · Individual · Livestock · Solar',
      cta: 'Apply Now',
      nav: ['Loans', 'Insurance', 'Savings', 'My Account', 'Branch Locator'],
    }
    case 'hr': return {
      hero: `Employee Self-Service Portal`,
      subhero: 'Payroll · Leave · Benefits · Documents',
      cta: 'Sign In',
      nav: ['Dashboard', 'Payslips', 'Leave', 'Benefits', 'Help Desk'],
    }
  }
}

export default function LandingPage() {
  const { state, dispatch, advanceStage, emitEvent } = useDemo()
  const world = state.world!
  const { company } = world
  const config = getHeroConfig(company.industry, company)

  // pendingLogin: store intent to login — show cookie modal first if not accepted
  const [pendingLogin, setPendingLogin] = useState(false)
  const [showCookieModal, setShowCookieModal] = useState(false)

  function handleCTAClick() {
    if (!state.cookieAccepted) {
      setPendingLogin(true)
      setShowCookieModal(true)
    } else {
      proceedToLogin()
    }
  }

  function handleCookieDecision(type: 'allow-all' | 'deny-all' | 'save-settings') {
    dispatch({ type: 'ACCEPT_COOKIE' })
    emitEvent({
      type: type === 'deny-all' ? 'COOKIE_DECLINE_ESSENTIAL' : 'COOKIE_ACCEPT',
      actor: 'customer',
      perspective: 'customer-app',
      payload: { cookieChoice: type },
      dpdpSection: '§6',
    })
    setShowCookieModal(false)
    if (pendingLogin) {
      setPendingLogin(false)
      proceedToLogin()
    }
  }

  function handleCookieSettingsClick(e: React.MouseEvent) {
    e.preventDefault()
    setShowCookieModal(true)
  }

  function proceedToLogin() {
    emitEvent({ type: 'LOGIN_INITIATED', actor: 'customer', perspective: 'customer-app', payload: {} })
    advanceStage('auth-login')
  }

  return (
    <div className="relative min-h-screen bg-white">
      {/* Cookie consent modal — shown on CTA click if not accepted, or via Cookie Settings link */}
      {showCookieModal && (
        <CookieConsentModal
          onAccept={(type, _categories) => handleCookieDecision(type)}
        />
      )}

      {/* Nav */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold bg-slate-700">
              {company.logoInitials}
            </div>
            <span className="font-semibold text-gray-900 text-sm">{company.name}</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            {config.nav.map(item => (
              <a key={item} href="#" onClick={e => e.preventDefault()} className="text-sm text-gray-600 hover:text-gray-900 transition">
                {item}
              </a>
            ))}
          </div>
          <button
            onClick={handleCTAClick}
            className="text-sm font-medium text-white px-4 py-1.5 rounded-lg transition hover:opacity-90 bg-[var(--perfios-blue)]"
          >
            Sign In
          </button>
        </div>
      </nav>

      {/* Hero — white background, bold heading, neutral styling */}
      <section className="py-20 px-4 text-center bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto">
          <div className="inline-block mb-4 px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100">
            {company.industry.charAt(0).toUpperCase() + company.industry.slice(1)} Services
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{config.hero}</h1>
          <p className="text-gray-500 text-lg mb-8">{config.subhero}</p>
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={handleCTAClick}
              className="bg-[var(--perfios-blue)] text-white font-semibold px-6 py-3 rounded-xl shadow-md hover:shadow-lg hover:bg-[var(--perfios-blue-700)] transition-all text-sm"
            >
              {config.cta}
            </button>
            <button className="border border-gray-300 text-gray-700 font-medium px-6 py-3 rounded-xl hover:bg-gray-50 transition text-sm">
              Know More
            </button>
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">Our Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {company.products.map(product => (
            <div key={product.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow group cursor-pointer">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                  {product.category}
                </span>
                <span className="text-sm font-semibold text-gray-800">{product.price}</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1 text-sm">{product.name}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{product.description}</p>
              <button
                onClick={handleCTAClick}
                className="mt-4 text-xs font-medium text-gray-400 hover:text-blue-600 group-hover:underline transition"
              >
                Get Started →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded flex items-center justify-center text-white text-xs font-bold bg-slate-700">
              {company.logoInitials.charAt(0)}
            </div>
            <span>{company.name} · {company.tagline}</span>
          </div>
          <div className="flex gap-4">
            <a href="#" onClick={e => e.preventDefault()} className="hover:text-gray-600 transition">Privacy Policy</a>
            <a href="#" onClick={e => e.preventDefault()} className="hover:text-gray-600 transition">Terms of Use</a>
            <a href="#" onClick={e => e.preventDefault()} className="hover:text-gray-600 transition">Grievance Redressal</a>
            <a href="#" onClick={handleCookieSettingsClick} className="hover:text-gray-600 transition">Cookie Settings</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
