import { useState } from 'react'
import './ImageComparison.css'

function ImageComparison({ originalImage, colorizedImage, isProcessing, error, onReset }) {
  const [downloadError, setDownloadError] = useState(null)

  const handleDownload = async () => {
    if (!colorizedImage) return

    try {
      setDownloadError(null)
      const response = await fetch(colorizedImage)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'colorized-image.jpg'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      setDownloadError('Failed to download image')
    }
  }

  return (
    <div className="comparison-container">
      <div className="comparison-header">
        <h2 className="comparison-title">Before & After</h2>
        <div className="comparison-actions">
          {colorizedImage && (
            <button className="download-button" onClick={handleDownload}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download
            </button>
          )}
          <button className="reset-button" onClick={onReset}>
            Upload New Image
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          {error}
        </div>
      )}

      {downloadError && (
        <div className="error-message">
          {downloadError}
        </div>
      )}

      <div className="comparison-grid">
        <div className="comparison-card">
          <div className="card-header">
            <span className="card-label">Original</span>
          </div>
          <div className="card-image-container">
            {originalImage && (
              <img
                src={originalImage}
                alt="Original"
                className="comparison-image"
              />
            )}
          </div>
        </div>

        <div className="comparison-card">
          <div className="card-header">
            <span className="card-label">Colorized</span>
            {isProcessing && (
              <span className="processing-badge">
                <span className="spinner"></span>
                Processing...
              </span>
            )}
          </div>
          <div className="card-image-container">
            {isProcessing ? (
              <div className="processing-overlay">
                <div className="processing-spinner">
                  <div className="spinner-large"></div>
                  <p>Colorizing your image...</p>
                </div>
              </div>
            ) : colorizedImage ? (
              <img
                src={colorizedImage}
                alt="Colorized"
                className="comparison-image"
              />
            ) : (
              <div className="placeholder">
                <p>Processing...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageComparison

