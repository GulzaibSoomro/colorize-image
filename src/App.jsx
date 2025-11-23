import { useState } from 'react'
import ImageUploader from './components/ImageUploader'
import ImageComparison from './components/ImageComparison'
import './App.css'

function App() {
  const [originalImage, setOriginalImage] = useState(null)
  const [colorizedImage, setColorizedImage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)

  const handleImageUpload = async (file) => {
    setError(null)
    setOriginalImage(null)
    setColorizedImage(null)

    // Create preview of original image
    const reader = new FileReader()
    reader.onload = (e) => {
      setOriginalImage(e.target.result)
    }
    reader.readAsDataURL(file)

    // Process image
    setIsProcessing(true)
    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/colorize', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = 'Failed to colorize image'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          // If response is not JSON, use default message
        }
        throw new Error(errorMessage)
      }

      const blob = await response.blob()
      const colorizedUrl = URL.createObjectURL(blob)
      setColorizedImage(colorizedUrl)
    } catch (err) {
      setError(err.message || 'An error occurred while processing the image')
      // Keep original image visible even on error
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setOriginalImage(null)
    setColorizedImage(null)
    setError(null)
    setIsProcessing(false)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">DeOldify Image Colorizer</h1>
        <p className="app-subtitle">Transform black and white photos into vibrant color</p>
      </header>

      <main className="app-main">
        {!originalImage && !colorizedImage ? (
          <ImageUploader onImageUpload={handleImageUpload} />
        ) : (
          <ImageComparison
            originalImage={originalImage}
            colorizedImage={colorizedImage}
            isProcessing={isProcessing}
            error={error}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  )
}

export default App

