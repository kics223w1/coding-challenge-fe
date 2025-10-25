import './App.css'
import { CurrencySwapForm } from '@/components/CurrencySwapForm'
import { TokenInfoBanner } from '@/components/TokenInfoBanner'

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#1a1625]">
      {/* Token Info Banner */}
      <TokenInfoBanner />
      
      {/* Main Content */}
      <div className="flex-1 flex items-start justify-center py-6 md:py-12">
        {/* Currency Swap Form */}
        <CurrencySwapForm />
      </div>
    </div>
  )
}

export default App
