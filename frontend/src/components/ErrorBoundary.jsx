import React from 'react';
import { toast } from 'react-toastify';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('Error Boundary caught an error:', error, errorInfo);

    // Update state with error info
    this.setState((prevState) => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1
    }));

    // Show toast notification
    toast.error('Something went wrong. Please try refreshing the page.', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f3f4f6',
            padding: '2rem'
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              padding: '2rem',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              maxWidth: '500px',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                fontSize: '3rem',
                marginBottom: '1rem',
                color: '#dc2626'
              }}
            >
              ⚠️
            </div>

            <h1
              style={{
                fontSize: '1.875rem',
                fontWeight: 'bold',
                color: '#1f2937',
                marginBottom: '0.5rem'
              }}
            >
              Oops! Something went wrong
            </h1>

            <p
              style={{
                color: '#6b7280',
                marginBottom: '1.5rem',
                fontSize: '0.95rem'
              }}
            >
              We encountered an unexpected error. Please try refreshing the page or contact support if the problem persists.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details
                style={{
                  backgroundColor: '#fee2e2',
                  border: '1px solid #fca5a5',
                  borderRadius: '0.375rem',
                  padding: '1rem',
                  textAlign: 'left',
                  marginBottom: '1.5rem',
                  cursor: 'pointer'
                }}
              >
                <summary style={{ fontWeight: '600', color: '#991b1b', cursor: 'pointer' }}>
                  Error Details (Development Only)
                </summary>
                <pre
                  style={{
                    marginTop: '0.5rem',
                    fontSize: '0.75rem',
                    color: '#7f1d1d',
                    overflow: 'auto',
                    maxHeight: '200px'
                  }}
                >
                  {this.state.error.toString()}
                  {this.state.errorInfo && this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}

            <div
              style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}
            >
              <button
                onClick={this.handleReset}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  borderRadius: '0.375rem',
                  border: 'none',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = '#1d4ed8')}
                onMouseOut={(e) => (e.target.style.backgroundColor = '#2563eb')}
              >
                Try Again
              </button>

              <button
                onClick={() => window.location.href = '/'}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: '#6b7280',
                  color: 'white',
                  borderRadius: '0.375rem',
                  border: 'none',
                  fontWeight: '600',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = '#4b5563')}
                onMouseOut={(e) => (e.target.style.backgroundColor = '#6b7280')}
              >
                Go to Home
              </button>
            </div>

            {this.state.errorCount > 3 && (
              <p
                style={{
                  marginTop: '1rem',
                  color: '#dc2626',
                  fontSize: '0.875rem',
                  fontWeight: '600'
                }}
              >
                Multiple errors detected. Please clear your browser cache or contact support.
              </p>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
