import { useState } from 'react'
import { useDemo } from '../store/store'

export default function AuthFlow() {
  const { state, dispatch, advanceStage, emitEvent } = useDemo()
  const stage = state.stage
  const world = state.world!
  const { company } = world

  // phone starts empty — customer fills it in (world.customer.phone may be '' after P0-1)
  const [phoneInput, setPhoneInput] = useState('')
  const [nameInput, setNameInput] = useState('')
  const [otpInput, setOtpInput] = useState('')
  const [error, setError] = useState('')

  function handleSendOTP() {
    if (phoneInput.length < 10) { setError('Enter a valid 10-digit mobile number'); return }
    setError('')
    advanceStage('auth-otp')
  }

  function handleVerifyOTP() {
    if (otpInput.length < 4) { setError('Enter the OTP'); return }
    if (!nameInput.trim()) { setError('Please enter your name'); return }
    setError('')

    // The customer name entered here drives everything downstream
    const finalName = nameInput.trim()
    if (state.world) {
      dispatch({
        type: 'SET_WORLD',
        payload: {
          ...state.world,
          customer: { ...state.world.customer, name: finalName, phone: phoneInput },
        },
      })
    }

    emitEvent({
      type: 'OTP_VERIFIED',
      actor: 'customer',
      perspective: 'customer-app',
      payload: { name: finalName, phone: phoneInput },
      dpdpSection: '§6',
    })
    dispatch({ type: 'SET_AUTHENTICATED' })
    advanceStage('consent-notice')
  }

  const isOTPStage = stage === 'auth-otp'
  const isGuardianJourney = world.customer.journeyType === 'guardian-minor' || world.customer.journeyType === 'guardian-disabled'

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Company header — neutral gray logo, no brand color */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-xl font-bold mx-auto mb-3 shadow-md bg-slate-700">
            {company.logoInitials}
          </div>
          <h1 className="text-xl font-bold text-gray-900">{company.name}</h1>
          <p className="text-gray-500 text-sm mt-1">{isOTPStage ? 'Enter OTP to continue' : 'Sign in to your account'}</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          {!isOTPStage ? (
            /* Phone entry */
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Mobile Number</label>
                <div className="flex gap-2">
                  <span className="flex items-center justify-center bg-gray-50 border border-gray-200 rounded-lg px-3 text-gray-500 text-sm font-medium">+91</span>
                  <input
                    value={phoneInput}
                    onChange={e => setPhoneInput(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="9876543210"
                    className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    onKeyDown={e => e.key === 'Enter' && handleSendOTP()}
                  />
                </div>
              </div>
              {error && <p className="text-red-500 text-xs">{error}</p>}
              <button
                onClick={handleSendOTP}
                className="w-full text-white font-semibold py-3 rounded-xl text-sm transition hover:opacity-90 bg-[var(--perfios-blue)]"
              >
                Send OTP
              </button>
              <p className="text-center text-xs text-gray-400">
                By continuing, you agree to our{' '}
                <span className="underline cursor-pointer text-blue-600">Terms of Service</span>
              </p>
            </div>
          ) : (
            /* OTP + name entry */
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">OTP</label>
                  <span className="text-xs text-gray-400">Sent to +91 {phoneInput}</span>
                </div>
                {/* 6 OTP boxes */}
                <div className="flex gap-2 mb-2">
                  {[0,1,2,3,4,5].map(i => (
                    <input
                      key={i}
                      maxLength={1}
                      value={otpInput[i] ?? ''}
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, '')
                        const arr = otpInput.split('')
                        arr[i] = val
                        setOtpInput(arr.join('').slice(0, 6))
                        if (val && i < 5) {
                          const next = document.getElementById(`otp-${i + 1}`)
                          next?.focus()
                        }
                      }}
                      id={`otp-${i}`}
                      className="w-10 h-12 text-center text-lg font-bold border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  ))}
                </div>
                <p className="text-xs text-gray-400">Demo: any 6 digits work</p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Your Name</label>
                <input
                  value={nameInput}
                  onChange={e => setNameInput(e.target.value)}
                  placeholder={world.customer.name || 'Enter your full name'}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  onKeyDown={e => e.key === 'Enter' && handleVerifyOTP()}
                />
                <p className="text-xs text-gray-400 mt-1">This name will appear on all consent records</p>
              </div>

              {error && <p className="text-red-500 text-xs">{error}</p>}

              <button
                onClick={handleVerifyOTP}
                className="w-full text-white font-semibold py-3 rounded-xl text-sm transition hover:opacity-90 bg-[var(--perfios-blue)]"
              >
                Verify & Continue
              </button>

              {isGuardianJourney && world.customer.guardianPhone && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800">
                  <p className="font-semibold mb-0.5">Guardian consent required — §9</p>
                  <p>An OTP will also be sent to the registered guardian: {world.customer.guardianPhone}</p>
                </div>
              )}

              <button onClick={() => advanceStage('auth-login')} className="w-full text-xs text-gray-400 hover:text-gray-600 transition py-1">
                ← Change number
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
