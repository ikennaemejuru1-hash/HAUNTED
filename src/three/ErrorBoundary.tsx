import { Component, type ReactNode } from 'react'

// If the 3D chunk fails to load or crashes, the site stays complete without it (design 11.2).
export class ErrorBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch() {
    this.props.onError()
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}
