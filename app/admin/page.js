'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabase'
import { FaLock, FaPlus, FaImage, FaLink } from 'react-icons/fa'

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  
  // Form states
  const [batchName, setBatchName] = useState('')
  const [batchLink, setBatchLink] = useState('')
  const [category, setCategory] = useState('foundation')
  const [classLevel, setClassLevel] = useState('Class 9')
  const [imageUrl, setImageUrl] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [uploadMethod, setUploadMethod] = useState('url') // 'url' or 'upload'

  const ADMIN_PASSWORD = 'GH123456'
  const SUPABASE_BUCKET = 'batches'

  const handleLogin = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setPassword('')
    } else {
      alert('Incorrect password!')
      setPassword('')
    }
  }

  const handleImageUpload = async () => {
    if (!imageFile) return null

    try {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      const { data, error } = await supabase.storage
        .from(SUPABASE_BUCKET)
        .upload(filePath, imageFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Storage upload error:', error)
        throw new Error(`Storage upload failed: ${error.message}. Please run the storage-policies.sql file in Supabase SQL Editor to enable public uploads.`)
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(SUPABASE_BUCKET)
        .getPublicUrl(filePath)

      return urlData.publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      alert(error.message || 'Failed to upload image. Make sure storage policies are set up correctly.')
      return null
    }
  }

  const handleAddBatch = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let finalImageUrl = imageUrl

      // If upload method is selected and file exists, upload it
      if (uploadMethod === 'upload' && imageFile) {
        const uploadedUrl = await handleImageUpload()
        if (!uploadedUrl) {
          setLoading(false)
          return
        }
        finalImageUrl = uploadedUrl
      }

      // Validate required fields
      if (!batchName || !batchLink || !finalImageUrl) {
        alert('Please fill all required fields!')
        setLoading(false)
        return
      }

      // Insert batch into database
      const { data, error } = await supabase
        .from('batches')
        .insert([
          {
            title: batchName,
            telegram_url: batchLink,
            image_url: finalImageUrl,
            category: category,
            class_level: classLevel
          }
        ])

      if (error) throw error

      alert('Batch added successfully!')
      
      // Reset form
      setBatchName('')
      setBatchLink('')
      setImageUrl('')
      setImageFile(null)
      setCategory('foundation')
      setClassLevel('Class 9')
      
    } catch (error) {
      console.error('Error adding batch:', error)
      alert('Failed to add batch: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 dark:bg-indigo-900 rounded-full mb-4">
              <FaLock className="text-3xl text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Admin Panel</h1>
            <p className="text-gray-600 dark:text-gray-400">Enter password to continue</p>
          </div>
          
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none mb-4"
              required
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Add New Batch</h1>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>

          <form onSubmit={handleAddBatch} className="space-y-6">
            {/* Batch Name */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Batch Name *
              </label>
              <input
                type="text"
                value={batchName}
                onChange={(e) => setBatchName(e.target.value)}
                placeholder="e.g., Arjuna JEE 3.0 2026"
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>

            {/* Batch Link */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Telegram Link *
              </label>
              <input
                type="url"
                value={batchLink}
                onChange={(e) => setBatchLink(e.target.value)}
                placeholder="https://t.me/+..."
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="foundation">Foundation</option>
                <option value="jee">JEE</option>
                <option value="neet">NEET</option>
                <option value="study-materials">Study Materials</option>
                <option value="khazana">Khazana</option>
              </select>
            </div>

            {/* Class Level */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Class Level *
              </label>
              <select
                value={classLevel}
                onChange={(e) => setClassLevel(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none"
              >
                <option value="Class 9">Class 9</option>
                <option value="Class 10">Class 10</option>
                <option value="Class 11">Class 11</option>
                <option value="Class 12">Class 12</option>
                <option value="Droppers">Droppers</option>
              </select>
            </div>

            {/* Image Upload Method */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Thumbnail Image *
              </label>
              <div className="flex gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => setUploadMethod('url')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-all ${
                    uploadMethod === 'url'
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                      : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <FaLink /> Image URL
                </button>
                <button
                  type="button"
                  onClick={() => setUploadMethod('upload')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-all ${
                    uploadMethod === 'upload'
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                      : 'border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <FaImage /> Upload Image
                </button>
              </div>

              {uploadMethod === 'url' ? (
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                  required={uploadMethod === 'url'}
                />
              ) : (
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                    required={uploadMethod === 'upload'}
                  />
                  {imageFile && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      Selected: {imageFile.name}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Adding Batch...
                </>
              ) : (
                <>
                  <FaPlus /> Add Batch
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
