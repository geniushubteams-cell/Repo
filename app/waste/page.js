'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { FaLock, FaPlus, FaImage, FaLink, FaTrash, FaBars } from 'react-icons/fa'

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('add-batch')
  
  // Batches and Banners
  const [batches, setBatches] = useState([])
  const [banners, setBanners] = useState([])
  
  // Add Batch Form
  const [batchName, setBatchName] = useState('')
  const [batchLink, setBatchLink] = useState('')
  const [category, setCategory] = useState('foundation')
  const [classLevel, setClassLevel] = useState('Class 9')
  const [year, setYear] = useState('2026')
  const [imageUrl, setImageUrl] = useState('')
  const [imageFile, setImageFile] = useState(null)
  const [uploadMethod, setUploadMethod] = useState('url')
  
  // Add Banner Form
  const [bannerImageUrl, setBannerImageUrl] = useState('')
  const [bannerLinkUrl, setBannerLinkUrl] = useState('')
  const [bannerImageFile, setBannerImageFile] = useState(null)
  const [bannerUploadMethod, setBannerUploadMethod] = useState('url')

  const ADMIN_PASSWORD = 'GH123456'
  const SUPABASE_BUCKET = 'batches'

  // Fetch batches
  useEffect(() => {
    if (isAuthenticated && activeTab === 'manage-batches') {
      fetchBatches()
    }
  }, [isAuthenticated, activeTab])

  // Fetch banners
  useEffect(() => {
    if (isAuthenticated && activeTab === 'manage-banners') {
      fetchBanners()
    }
  }, [isAuthenticated, activeTab])

  const fetchBatches = async () => {
    try {
      const { data, error } = await supabase
        .from('batches')
        .select('*')
        .order('year', { ascending: false })
        .order('category', { ascending: true })
        .order('class_level', { ascending: true })
      
      if (error) throw error
      setBatches(data || [])
    } catch (error) {
      console.error('Error fetching batches:', error)
    }
  }

  const fetchBanners = async () => {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('display_order', { ascending: true })
      
      if (error) throw error
      setBanners(data || [])
    } catch (error) {
      console.error('Error fetching banners:', error)
    }
  }

  const deleteBatch = async (id) => {
    if (!confirm('Are you sure you want to delete this batch?')) return
    
    try {
      const { error } = await supabase
        .from('batches')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      alert('Batch deleted successfully!')
      fetchBatches()
    } catch (error) {
      console.error('Error deleting batch:', error)
      alert('Failed to delete batch')
    }
  }

  const deleteBanner = async (id) => {
    if (!confirm('Are you sure you want to delete this banner?')) return
    
    try {
      const { error} = await supabase
        .from('banners')
        .delete()
        .eq('id', id)
      
      if (error) throw error
      alert('Banner deleted successfully!')
      fetchBanners()
    } catch (error) {
      console.error('Error deleting banner:', error)
      alert('Failed to delete banner')
    }
  }

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

  const handleImageUpload = async (file) => {
    if (!file) return null

    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `${fileName}`

      const { data, error } = await supabase.storage
        .from(SUPABASE_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Storage upload error:', error)
        throw new Error(`Storage upload failed: ${error.message}`)
      }

      const { data: urlData } = supabase.storage
        .from(SUPABASE_BUCKET)
        .getPublicUrl(filePath)

      return urlData.publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      alert(error.message || 'Failed to upload image')
      return null
    }
  }

  const handleAddBatch = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let finalImageUrl = imageUrl

      if (uploadMethod === 'upload' && imageFile) {
        const uploadedUrl = await handleImageUpload(imageFile)
        if (!uploadedUrl) {
          setLoading(false)
          return
        }
        finalImageUrl = uploadedUrl
      }

      if (!batchName || !batchLink || !finalImageUrl) {
        alert('Please fill all required fields!')
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('batches')
        .insert([
          {
            title: batchName,
            telegram_url: batchLink,
            image_url: finalImageUrl,
            category: category,
            class_level: classLevel,
            year: year
          }
        ])

      if (error) throw error

      alert('Batch added successfully!')
      
      setBatchName('')
      setBatchLink('')
      setImageUrl('')
      setImageFile(null)
      setCategory('foundation')
      setClassLevel('Class 9')
      setYear('2026')
      
    } catch (error) {
      console.error('Error adding batch:', error)
      alert('Failed to add batch: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAddBanner = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let finalImageUrl = bannerImageUrl

      if (bannerUploadMethod === 'upload' && bannerImageFile) {
        const uploadedUrl = await handleImageUpload(bannerImageFile)
        if (!uploadedUrl) {
          setLoading(false)
          return
        }
        finalImageUrl = uploadedUrl
      }

      if (!finalImageUrl || !bannerLinkUrl) {
        alert('Please fill all required fields!')
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('banners')
        .insert([
          {
            image_url: finalImageUrl,
            link_url: bannerLinkUrl,
            display_order: banners.length,
            is_active: true
          }
        ])

      if (error) throw error

      alert('Banner added successfully!')
      
      setBannerImageUrl('')
      setBannerLinkUrl('')
      setBannerImageFile(null)
      fetchBanners()
      
    } catch (error) {
      console.error('Error adding banner:', error)
      alert('Failed to add banner: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const groupBatchesByCategory = () => {
    const row1 = batches.filter(b => b.category === 'study-materials' || b.category === 'foundation')
    const row2 = batches.filter(b => b.category === 'jee' || b.category === 'neet')
    const row3 = batches.filter(b => b.category === 'khazana')
    return { row1, row2, row3 }
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

  const { row1, row2, row3 } = groupBatchesByCategory()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Panel</h1>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('add-batch')}
              className={`pb-4 px-4 font-bold transition-colors ${
                activeTab === 'add-batch'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Add Batch
            </button>
            <button
              onClick={() => setActiveTab('manage-batches')}
              className={`pb-4 px-4 font-bold transition-colors ${
                activeTab === 'manage-batches'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Manage Batches
            </button>
            <button
              onClick={() => setActiveTab('manage-banners')}
              className={`pb-4 px-4 font-bold transition-colors ${
                activeTab === 'manage-banners'
                  ? 'border-b-2 border-indigo-600 text-indigo-600'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              Manage Banners
            </button>
          </div>

          {/* Add Batch Tab */}
          {activeTab === 'add-batch' && (
            <form onSubmit={handleAddBatch} className="space-y-6">
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
                  <option value="JEE">JEE</option>
                  <option value="NEET">NEET</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  Academic Year *
                </label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                >
                  <option value="2026">2026</option>
                  <option value="2027">2027</option>
                  <option value="2028">2028</option>
                </select>
              </div>

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
          )}

          {/* Manage Batches Tab */}
          {activeTab === 'manage-batches' && (
            <div className="space-y-8">
              {/* Row 1: Study Materials & Foundation */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Study Materials & Foundation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {row1.map((batch) => (
                    <div key={batch.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                      <img src={batch.image_url} alt={batch.title} className="w-full h-32 object-cover rounded mb-3" />
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2">{batch.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {batch.category} - {batch.class_level}
                      </p>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mb-2">
                        📅 Year: {batch.year || 'N/A'}
                      </p>
                      <button
                        onClick={() => deleteBatch(batch.id)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded flex items-center justify-center gap-2"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 2: JEE & NEET */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">JEE & NEET</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {row2.map((batch) => (
                    <div key={batch.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                      <img src={batch.image_url} alt={batch.title} className="w-full h-32 object-cover rounded mb-3" />
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2">{batch.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {batch.category} - {batch.class_level}
                      </p>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mb-2">
                        📅 Year: {batch.year || 'N/A'}
                      </p>
                      <button
                        onClick={() => deleteBatch(batch.id)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded flex items-center justify-center gap-2"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 3: Khazana */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Khazana</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {row3.map((batch) => (
                    <div key={batch.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                      <img src={batch.image_url} alt={batch.title} className="w-full h-32 object-cover rounded mb-3" />
                      <h4 className="font-bold text-gray-900 dark:text-white mb-2">{batch.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {batch.category} - {batch.class_level}
                      </p>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mb-2">
                        📅 Year: {batch.year || 'N/A'}
                      </p>
                      <button
                        onClick={() => deleteBatch(batch.id)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded flex items-center justify-center gap-2"
                      >
                        <FaTrash /> Delete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Manage Banners Tab */}
          {activeTab === 'manage-banners' && (
            <div className="space-y-6">
              <form onSubmit={handleAddBanner} className="space-y-4 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add New Banner</h3>
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Banner Image *
                  </label>
                  <div className="flex gap-4 mb-4">
                    <button
                      type="button"
                      onClick={() => setBannerUploadMethod('url')}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-all ${
                        bannerUploadMethod === 'url'
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600'
                          : 'border-gray-300 dark:border-gray-600 text-gray-600'
                      }`}
                    >
                      <FaLink /> Image URL
                    </button>
                    <button
                      type="button"
                      onClick={() => setBannerUploadMethod('upload')}
                      className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border-2 transition-all ${
                        bannerUploadMethod === 'upload'
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600'
                          : 'border-gray-300 dark:border-gray-600 text-gray-600'
                      }`}
                    >
                      <FaImage /> Upload Image
                    </button>
                  </div>

                  {bannerUploadMethod === 'url' ? (
                    <input
                      type="url"
                      value={bannerImageUrl}
                      onChange={(e) => setBannerImageUrl(e.target.value)}
                      placeholder="https://example.com/banner.jpg"
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                      required={bannerUploadMethod === 'url'}
                    />
                  ) : (
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setBannerImageFile(e.target.files[0])}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                      required={bannerUploadMethod === 'upload'}
                    />
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                    Link URL *
                  </label>
                  <input
                    type="url"
                    value={bannerLinkUrl}
                    onChange={(e) => setBannerLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                    className="w-full px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-indigo-500 focus:outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2"
                >
                  {loading ? 'Adding...' : <><FaPlus /> Add Banner</>}
                </button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {banners.map((banner) => (
                  <div key={banner.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                    <img src={banner.image_url} alt="Banner" className="w-full h-40 object-cover rounded mb-3" />
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 truncate">
                      Link: {banner.link_url}
                    </p>
                    <button
                      onClick={() => deleteBanner(banner.id)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded flex items-center justify-center gap-2"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
