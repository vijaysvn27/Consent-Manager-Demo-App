import { useState } from 'react'
import { useDemo } from '../../store/store'
import HomeTab from './HomeTab'
import ConsentsTab from './ConsentsTab'
import MyDataTab from './MyDataTab'
import NotificationsTab from './NotificationsTab'
import ProfileTab from './ProfileTab'

type Tab = 'home' | 'consents' | 'data' | 'notifications' | 'profile'

const TABS: { id: Tab; label: string; icon: (active: boolean) => JSX.Element }[] = [
  {
    id: 'home', label: 'Home',
    icon: (a) => <svg className={`w-5 h-5 ${a ? 'text-current' : 'text-gray-400'}`} fill={a ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={a ? 0 : 2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  },
  {
    id: 'consents', label: 'Consents',
    icon: (a) => <svg className={`w-5 h-5 ${a ? 'text-current' : 'text-gray-400'}`} fill={a ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={a ? 0 : 2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  },
  {
    id: 'data', label: 'My Data',
    icon: (a) => <svg className={`w-5 h-5 ${a ? 'text-current' : 'text-gray-400'}`} fill={a ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={a ? 0 : 2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" /></svg>,
  },
  {
    id: 'notifications', label: 'Alerts',
    icon: (a) => <svg className={`w-5 h-5 ${a ? 'text-current' : 'text-gray-400'}`} fill={a ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={a ? 0 : 2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
  },
  {
    id: 'profile', label: 'Profile',
    icon: (a) => <svg className={`w-5 h-5 ${a ? 'text-current' : 'text-gray-400'}`} fill={a ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={a ? 0 : 2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  },
]

export default function CustomerApp() {
  const { state } = useDemo()
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const world = state.world!
  const { company } = world

  return (
    <div className="flex flex-col h-full bg-gray-50 relative overflow-hidden">
      {/* Status bar */}
      <div className="bg-white px-4 pt-2.5 pb-1 flex items-center justify-between border-b border-gray-100">
        <span className="text-xs font-semibold text-gray-900">9:41</span>
        <div className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-gray-700" fill="currentColor" viewBox="0 0 24 24"><path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0119 12.55M5 12.55a10.94 10.94 0 015.17-2.39M10.71 5.05A16 16 0 0122.56 9M1.42 9a15.91 15.91 0 014.7-2.88M8.53 16.11a6 6 0 016.95 0M12 20h.01" /></svg>
          <svg className="w-3.5 h-3.5 text-gray-700" fill="currentColor" viewBox="0 0 24 24"><rect x="1" y="6" width="3" height="11" rx="1" /><rect x="6" y="4" width="3" height="13" rx="1" /><rect x="11" y="2" width="3" height="15" rx="1" /><rect x="16" y="0" width="3" height="17" rx="1" opacity="0.4" /></svg>
          <svg className="w-4 h-3.5 text-gray-700" fill="currentColor" viewBox="0 0 24 16"><rect x="0.5" y="0.5" width="20" height="15" rx="3.5" stroke="currentColor" strokeWidth="1" fill="none" /><rect x="2" y="2" width="14" height="12" rx="2" /><path d="M22 5v6a3 3 0 000-6z" /></svg>
        </div>
      </div>

      {/* App header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold bg-[var(--perfios-blue)]">
            {company.logoInitials.charAt(0)}
          </div>
          <span className="text-sm font-semibold text-gray-900">{company.shortName}</span>
        </div>
        <button
          onClick={() => setActiveTab('notifications')}
          className="relative p-1.5 rounded-full hover:bg-gray-100"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          {state.unreadNotifications > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center leading-none">
              {state.unreadNotifications}
            </span>
          )}
        </button>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'home' && <HomeTab onNavigate={setActiveTab} />}
        {activeTab === 'consents' && <ConsentsTab />}
        {activeTab === 'data' && <MyDataTab />}
        {activeTab === 'notifications' && <NotificationsTab />}
        {activeTab === 'profile' && <ProfileTab />}
      </div>

      {/* Tab bar */}
      <div className="bg-white border-t border-gray-200 flex items-stretch safe-bottom">
        {TABS.map(tab => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2 relative transition-colors ${isActive ? '' : 'text-gray-400'}`}
              style={{ color: isActive ? 'var(--perfios-blue)' : undefined }}
            >
              {tab.id === 'notifications' && state.unreadNotifications > 0 && (
                <span className="absolute top-1 right-1/4 -translate-x-1/2 w-2 h-2 bg-red-500 rounded-full" />
              )}
              {tab.icon(isActive)}
              <span className="text-xs">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
