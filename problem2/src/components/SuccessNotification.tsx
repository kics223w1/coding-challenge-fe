import { X, CheckCircle } from "lucide-react"

interface SuccessNotificationProps {
  message: string
  onClose: () => void
}

/**
 * Success notification toast component
 * Displays a dismissible success message at the top of the screen
 */
export function SuccessNotification({ message, onClose }: SuccessNotificationProps) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
      <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 min-w-[320px] max-w-md">
        <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <CheckCircle className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="font-semibold text-sm">Swap Successful!</div>
          <div className="text-xs text-white/90 mt-0.5">{message}</div>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 hover:bg-white/20 rounded-full p-1 transition-colors"
          aria-label="Close notification"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

