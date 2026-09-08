import React, { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('SnapSteady Error Boundary Caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#070e1c', color: '#fff', padding: '20px', fontFamily: 'sans-serif' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#FFD600', marginBottom: '12px' }}>SnapSteady AI — Recovering Live Feed</h2>
          <p style={{ color: '#ccc', marginBottom: '20px' }}>An interface reload is needed.</p>
          <button onClick={() => window.location.reload()} style={{ padding: '10px 24px', borderRadius: '12px', background: '#FFD600', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>
            Reload Viewfinder
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)

