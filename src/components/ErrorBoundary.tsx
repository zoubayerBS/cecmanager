import { Component, type ReactNode } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, _errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error.message)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-xl p-6 max-w-sm w-full text-center">
            <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} className="text-red-500" />
            </div>
            <h2 className="text-base font-semibold text-gray-900 mb-1">Une erreur est survenue</h2>
            <p className="text-sm text-gray-500 mb-4">
              L'application a rencontré un problème inattendu. Veuillez réessayer.
            </p>
            <button onClick={this.handleReset}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
              <RefreshCw size={14} /> Réessayer
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}