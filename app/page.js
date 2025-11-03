          'use client'

import { useState, useEffect } from 'react'
import { FaGraduationCap, FaBook, FaFlask, FaMedkit, FaYoutube, FaWhatsapp, FaRobot, FaPhone, FaBars, FaTimes, FaMoon, FaSun, FaUsers, FaArrowLeft } from 'react-icons/fa'
import Image from 'next/image'
import useSecurity from './shared/useSecurity';
import { supabase } from '../lib/supabase'
import Banner from '../components/Banner'

export default function Home() {
    useSecurity(); 
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [activeTab, setActiveTab] = useState('all-batches')
  const [activeStudyTab, setActiveStudyTab] = useState('foundation')
  const [activeFoundationClass, setActiveFoundationClass] = useState(null)
  const [activeJeeClass, setActiveJeeClass] = useState(null)
  const [activeNeetClass, setActiveNeetClass] = useState(null)
  const [activeStudyMaterialsClass, setActiveStudyMaterialsClass] = useState(null)
  const [activeKhazanaClass, setActiveKhazanaClass] = useState(null)
  const [activeYear, setActiveYear] = useState(null)
  const [showBatchesList, setShowBatchesList] = useState(false)
  const [batches, setBatches] = useState([])
  const [loading, setLoading] = useState(false)
  const [enrolledBatches, setEnrolledBatches] = useState([])
  const [userId, setUserId] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gh_user_id')
      return saved || 'user_' + Math.random().toString(36).substr(2, 9)
    }
    return 'user_' + Math.random().toString(36).substr(2, 9)
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Save userId to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gh_user_id', userId)
    }
  }, [userId])

  // Load enrolled batches from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('gh_enrolled_batches')
      if (saved) {
        setEnrolledBatches(JSON.parse(saved))
      }
    }
    fetchEnrolledBatches()
  }, [userId])

  // Fetch all batches when My Batches tab is active
  useEffect(() => {
    if (activeTab === 'my-batches' && enrolledBatches.length > 0) {
      fetchBatches()
    }
  }, [activeTab, enrolledBatches])

  // Fetch batches from Supabase
  const fetchBatches = async (category, classLevel, year) => {
    setLoading(true)
    try {
      let query = supabase.from('batches').select('*')
      
      if (category) {
        query = query.eq('category', category)
      }
      
      if (classLevel) {
        query = query.eq('class_level', classLevel)
      }
      
      if (year) {
        query = query.eq('year', year)
      }
      
      const { data, error } = await query.order('created_at', { ascending: false })
      
      if (error) throw error
      
      setBatches(data || [])
    } catch (error) {
      console.error('Error fetching batches:', error)
      setBatches([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch enrolled batches
  const fetchEnrolledBatches = async () => {
    try {
      const { data, error } = await supabase
        .from('user_batches')
        .select('batch_id')
        .eq('user_id', userId)
      
      if (error) throw error
      
      const batchIds = data.map(item => item.batch_id)
      
      // Merge with localStorage
      const localSaved = typeof window !== 'undefined' ? localStorage.getItem('gh_enrolled_batches') : null
      const localBatches = localSaved ? JSON.parse(localSaved) : []
      const merged = [...new Set([...batchIds, ...localBatches])]
      
      setEnrolledBatches(merged)
      if (typeof window !== 'undefined') {
        localStorage.setItem('gh_enrolled_batches', JSON.stringify(merged))
      }
    } catch (error) {
      console.error('Error fetching enrolled batches:', error)
    }
  }

  // Enroll in batch
  const enrollInBatch = async (batchId) => {
    try {
      const { error } = await supabase
        .from('user_batches')
        .insert({ user_id: userId, batch_id: batchId })
      
      if (error) throw error
      
      // Update enrolled batches list
      const updated = [...enrolledBatches, batchId]
      setEnrolledBatches(updated)
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('gh_enrolled_batches', JSON.stringify(updated))
      }
      
      alert('Successfully enrolled in batch!')
    } catch (error) {
      console.error('Error enrolling in batch:', error)
      alert('Failed to enroll. You may already be enrolled in this batch.')
    }
  }

  // Check if batch is enrolled
  const isBatchEnrolled = (batchId) => {
    return enrolledBatches.includes(batchId)
  }

  // Telegram popup
  useEffect(() => {
    function showPopup(){const p=document.getElementById('telegramPopup');if(p) p.style.display='flex';}
    function hidePopup(){const p=document.getElementById('telegramPopup');if(p) p.style.display='none';}
    
    const timer = setTimeout(showPopup,1200);
    
    const closeBtn = document.getElementById('popupClose');
    const popup = document.getElementById('telegramPopup');
    
    if(closeBtn) closeBtn.onclick = hidePopup;
    
    // Close popup when clicking outside
    if(popup) {
      popup.onclick = (e) => {
        if(e.target.id === 'telegramPopup') hidePopup();
      };
    }
    
    return () => clearTimeout(timer);
  }, []);

  const sidebarTabs = [
    { id: 'all-batches', label: 'All Batches', icon: <FaUsers /> },
    { id: 'my-batches', label: 'My Batches', icon: <FaGraduationCap /> },
    { id: 'contact-bot', label: 'Contact Bot', icon: <FaRobot />, link: 'https://t.me/GENIUS_HUB_OWNER_BOT' },
    { id: 'youtube', label: 'YouTube Channel', icon: <FaYoutube />, link: 'https://youtube.com/@geniushubteam?si=ZOIWTuUWDA9gW--I' },
    { id: 'whatsapp', label: 'WhatsApp Channel', icon: <FaWhatsapp />, link: 'https://whatsapp.com/channel/0029Vb6US0KGzzKZNTxQBW1f' },
  ]

  const studyMaterialTabs = [
    { id: 'study-materials', label: 'Study Materials', icon: <FaBook /> },
    { id: 'foundation', label: 'Foundation', icon: <FaBook /> },
    { id: 'jee', label: 'JEE', icon: <FaFlask /> },
    { id: 'neet', label: 'NEET', icon: <FaMedkit /> },
    { id: 'khazana', label: 'Khazana', icon: <FaGraduationCap /> },
  ]

  const foundationClasses = ['Class 9', 'Class 10', 'Class 11', 'Class 12']
  const competitiveClasses = ['Class 11', 'Class 12', 'Droppers']
  const khazanaClasses = ['Class 9', 'Class 10', 'Class 11', 'Class 12', 'JEE', 'NEET']

  // Sample batches data
  const allBatchesData = [
    { id: 1, name: 'Foundation Batch 2024', category: 'Foundation', students: 45, enrolled: false },
    { id: 2, name: 'JEE Advanced 2025', category: 'JEE', students: 120, enrolled: true },
    { id: 3, name: 'NEET Crash Course', category: 'NEET', students: 89, enrolled: false },
    { id: 4, name: 'Class 12 Physics', category: 'Foundation', students: 67, enrolled: true },
    { id: 5, name: 'JEE Mains Preparation', category: 'JEE', students: 156, enrolled: false },
    { id: 6, name: 'NEET Biology Master', category: 'NEET', students: 92, enrolled: true },
    { id: 7, name: 'Class 10 Mathematics', category: 'Foundation', students: 78, enrolled: false },
    { id: 8, name: 'JEE Chemistry Plus', category: 'JEE', students: 134, enrolled: false },
  ]

  const myBatchesData = allBatchesData.filter(batch => batch.enrolled)

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
        
        {/* Sidebar - At the TOP level, above everything */}
        <aside
          className={`fixed top-0 left-0 h-full bg-white dark:bg-gray-800 shadow-2xl z-50 transition-transform duration-300 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0 w-72`}
        >
          <div className="p-6 h-full overflow-y-auto">
            {/* Logo and Header in Sidebar */}
            <div className="flex items-center mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg">
                  <img src="https://i.postimg.cc/bdZH7Cmb/image.png" alt="Genius Hub Logo" className="w-full h-full object-cover" />
                </div>
                <h2 className="text-xl font-extrabold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(249,115,22,0.8)] uppercase">
                  GENIUS HUB
                </h2>
              </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="space-y-2">
              {sidebarTabs.map((tab) => (
                tab.link ? (
                  <a
                    key={tab.id}
                    href={tab.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <span className="text-xl">{tab.icon}</span>
                    <span className="font-medium">{tab.label}</span>
                  </a>
                ) : (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id)
                      setSidebarOpen(false)
                    }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="text-xl">{tab.icon}</span>
                    <span className="font-medium">{tab.label}</span>
                  </button>
                )
              ))}
            </nav>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Topbar - Below sidebar in z-index */}
        <header className="fixed top-0 left-0 lg:left-72 right-0 bg-white dark:bg-gray-800 shadow-lg z-30 transition-all duration-300">
          <div className="flex items-center justify-between px-6 py-4">
            {/* Left side: Hamburger + Logo + Header */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden text-gray-700 dark:text-gray-300 hover:text-indigo-600 transition-colors"
              >
                <FaBars size={24} />
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full overflow-hidden shadow-lg flex-shrink-0">
                  <img src="https://i.postimg.cc/bdZH7Cmb/image.png" alt="Genius Hub Logo" className="w-full h-full object-cover" />
                </div>
                <h1 className="text-xl font-extrabold bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_20px_rgba(249,115,22,0.8)] uppercase leading-none">
                  GENIUS HUB
                </h1>
              </div>
            </div>
            
            {/* Right side: Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-yellow-400 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 transform hover:scale-110"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="pt-[72px] lg:pl-72 min-h-screen">
          <div className="p-6 md:p-8">
            
            {/* Banner Section */}
            <div className="mb-8">
              <Banner />
            </div>
            
            {/* My Batches Tab */}
            {activeTab === 'my-batches' && (
              <div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">My Batches</h2>
                
                {loading ? (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your batches...</p>
                  </div>
                ) : enrolledBatches.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {batches.filter(batch => enrolledBatches.includes(batch.id)).map((batch) => (
                      <div
                        key={batch.id}
                        className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-gray-100 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500"
                      >
                        <div className="relative overflow-hidden">
                          {batch.image_url && (
                            <img 
                              src={batch.image_url} 
                              alt={batch.title}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                        </div>
                        <div className="p-5">
                          <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">{batch.title}</h4>
                          <a
                            href={batch.telegram_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-2.5 px-4 rounded-lg transition-all duration-200 text-center shadow-md hover:shadow-lg"
                          >
                            Join Batch
                          </a>
                        </div>
                        <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                          ✓ ENROLLED
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 p-8 rounded-lg text-center">
                      <p className="text-gray-600 dark:text-gray-300 text-lg">No batches enrolled yet. Enroll in batches from "All Batches" section!</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* All Batches Tab */}
            {activeTab === 'all-batches' && (
              <div>
                {/* Year Selection - Show first */}
                {!activeYear && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                    <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">
                      Select Academic Year
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                      {['2026', '2027'].map((year) => (
                        <button
                          key={year}
                          onClick={() => {
                            setActiveYear(year)
                            setActiveStudyTab('foundation')
                          }}
                          className="group relative bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-600 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all duration-300 hover:shadow-2xl hover:scale-105"
                        >
                          <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-2">
                            {year}
                          </div>
                          <div className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                            Academic Year {year}
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Category Tabs - Show after year selection */}
                {activeYear && !showBatchesList && (
                  <div>
                    {/* Back to Year Selection */}
                    <button
                      onClick={() => {
                        setActiveYear(null)
                        setActiveStudyTab('foundation')
                        setActiveFoundationClass(null)
                        setActiveJeeClass(null)
                        setActiveNeetClass(null)
                        setActiveKhazanaClass(null)
                        setActiveStudyMaterialsClass(null)
                        setBatches([])
                      }}
                      className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mb-6 transition-colors"
                    >
                      <FaArrowLeft />
                      <span>Back to Year Selection</span>
                    </button>

                    {/* Year Badge */}
                    <div className="mb-6 inline-block bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full font-bold text-lg shadow-lg">
                      📅 Academic Year {activeYear}
                    </div>

                    {/* Category Tabs in 3 Rows */}
                    <div className="space-y-4 mb-8">
                      {/* Row 1: Study Materials & Foundation */}
                      <div className="flex flex-wrap gap-4">
                        {studyMaterialTabs.slice(0, 2).map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => {
                              setActiveStudyTab(tab.id)
                              setActiveFoundationClass(null)
                              setActiveJeeClass(null)
                              setActiveNeetClass(null)
                              setActiveKhazanaClass(null)
                              setActiveStudyMaterialsClass(null)
                              setShowBatchesList(false)
                            }}
                            className={`flex-1 min-w-[200px] flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                              activeStudyTab === tab.id
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transform scale-105'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md'
                            }`}
                          >
                            <span className="text-xl">{tab.icon}</span>
                            <span>{tab.label}</span>
                          </button>
                        ))}
                      </div>
                      
                      {/* Row 2: JEE & NEET */}
                      <div className="flex flex-wrap gap-4">
                        {studyMaterialTabs.slice(2, 4).map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => {
                              setActiveStudyTab(tab.id)
                              setActiveFoundationClass(null)
                              setActiveJeeClass(null)
                              setActiveNeetClass(null)
                              setActiveKhazanaClass(null)
                              setActiveStudyMaterialsClass(null)
                              setShowBatchesList(false)
                            }}
                            className={`flex-1 min-w-[200px] flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                              activeStudyTab === tab.id
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transform scale-105'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md'
                            }`}
                          >
                            <span className="text-xl">{tab.icon}</span>
                            <span>{tab.label}</span>
                          </button>
                        ))}
                      </div>
                      
                      {/* Row 3: Khazana */}
                      <div className="flex flex-wrap gap-4">
                        {studyMaterialTabs.slice(4).map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => {
                              setActiveStudyTab(tab.id)
                              setActiveFoundationClass(null)
                              setActiveJeeClass(null)
                              setActiveNeetClass(null)
                              setActiveKhazanaClass(null)
                              setActiveStudyMaterialsClass(null)
                              setShowBatchesList(false)
                            }}
                            className={`flex-1 min-w-[200px] flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                              activeStudyTab === tab.id
                                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transform scale-105'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md'
                            }`}
                          >
                            <span className="text-xl">{tab.icon}</span>
                            <span>{tab.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Class Selection for Study Materials */}
                {activeYear && activeStudyTab === 'study-materials' && !showBatchesList && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                      <FaBook className="mr-3 text-indigo-600" />
                      Study Materials
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Select your class to view study materials</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {foundationClasses.map((cls) => (
                        <button
                          key={cls}
                          onClick={() => {
                            setActiveStudyMaterialsClass(cls)
                            setShowBatchesList(true)
                            fetchBatches('study-materials', cls, activeYear)
                          }}
                          className="p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-600 transition-all duration-200"
                        >
                          <div className="text-3xl font-bold mb-1">{cls.split(' ')[1]}</div>
                          <div className="text-sm font-medium">{cls}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Batches List for Study Materials */}
                {activeYear && activeStudyTab === 'study-materials' && showBatchesList && activeStudyMaterialsClass && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <button
                      onClick={() => {
                        setShowBatchesList(false)
                        setActiveStudyMaterialsClass(null)
                        setBatches([])
                      }}
                      className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mb-4 transition-colors"
                    >
                      <FaArrowLeft />
                      <span>Back to Classes</span>
                    </button>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                      {activeStudyMaterialsClass} - Study Materials
                    </h3>
                    
                    {loading ? (
                      <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading batches...</p>
                      </div>
                    ) : batches.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {batches.map((batch) => (
                          <div
                            key={batch.id}
                            className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-gray-100 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500"
                          >
                            <div className="relative overflow-hidden">
                              {batch.image_url && (
                                <img 
                                  src={batch.image_url} 
                                  alt={batch.title}
                                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            </div>
                            <div className="p-5">
                              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">{batch.title}</h4>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => enrollInBatch(batch.id)}
                                  disabled={isBatchEnrolled(batch.id)}
                                  className={`flex-1 font-bold py-2.5 px-4 rounded-lg transition-all duration-200 ${
                                    isBatchEnrolled(batch.id)
                                      ? 'bg-green-600 text-white cursor-not-allowed'
                                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg'
                                  }`}
                                >
                                  {isBatchEnrolled(batch.id) ? '✓ Enrolled' : 'Enroll'}
                                </button>
                                <a
                                  href={batch.telegram_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-2.5 px-4 rounded-lg transition-all duration-200 text-center shadow-md hover:shadow-lg"
                                >
                                  Join Batch
                                </a>
                              </div>
                            </div>
                            {isBatchEnrolled(batch.id) && (
                              <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                ✓ ENROLLED
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 p-8 rounded-lg text-center">
                        <p className="text-gray-600 dark:text-gray-300 text-lg">No study materials available yet for {activeStudyMaterialsClass}.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Class Selection for Foundation */}
                {activeYear && activeStudyTab === 'foundation' && !showBatchesList && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                      <FaBook className="mr-3 text-indigo-600" />
                      Foundation Courses
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Select your class to view batches</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {foundationClasses.map((cls) => (
                        <button
                          key={cls}
                          onClick={() => {
                            setActiveFoundationClass(cls)
                            setShowBatchesList(true)
                            fetchBatches('foundation', cls, activeYear)
                          }}
                          className="p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-600 transition-all duration-200"
                        >
                          <div className="text-3xl font-bold mb-1">{cls.split(' ')[1]}</div>
                          <div className="text-sm font-medium">{cls}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Batches List for Foundation */}
                {activeYear && activeStudyTab === 'foundation' && showBatchesList && activeFoundationClass && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <button
                      onClick={() => {
                        setShowBatchesList(false)
                        setActiveFoundationClass(null)
                        setBatches([])
                      }}
                      className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mb-4 transition-colors"
                    >
                      <FaArrowLeft />
                      <span>Back to Classes</span>
                    </button>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                      {activeFoundationClass} - Batches
                    </h3>
                    
                    {loading ? (
                      <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading batches...</p>
                      </div>
                    ) : batches.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {batches.map((batch) => (
                          <div
                            key={batch.id}
                            className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-gray-100 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500"
                          >
                            <div className="relative overflow-hidden">
                              {batch.image_url && (
                                <img 
                                  src={batch.image_url} 
                                  alt={batch.title}
                                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            </div>
                            <div className="p-5">
                              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">{batch.title}</h4>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => enrollInBatch(batch.id)}
                                  disabled={isBatchEnrolled(batch.id)}
                                  className={`flex-1 font-bold py-2.5 px-4 rounded-lg transition-all duration-200 ${
                                    isBatchEnrolled(batch.id)
                                      ? 'bg-green-600 text-white cursor-not-allowed'
                                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg'
                                  }`}
                                >
                                  {isBatchEnrolled(batch.id) ? '✓ Enrolled' : 'Enroll'}
                                </button>
                                <a
                                  href={batch.telegram_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-2.5 px-4 rounded-lg transition-all duration-200 text-center shadow-md hover:shadow-lg"
                                >
                                  Join Batch
                                </a>
                              </div>
                            </div>
                            {isBatchEnrolled(batch.id) && (
                              <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                ✓ ENROLLED
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 p-8 rounded-lg text-center">
                        <p className="text-gray-600 dark:text-gray-300 text-lg">No batches available yet for {activeFoundationClass}.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Class Selection for JEE */}
                {activeYear && activeStudyTab === 'jee' && !showBatchesList && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                      <FaFlask className="mr-3 text-indigo-600" />
                      JEE Preparation
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Select your level to view batches</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {competitiveClasses.map((cls) => (
                        <button
                          key={cls}
                          onClick={() => {
                            setActiveJeeClass(cls)
                            setShowBatchesList(true)
                            fetchBatches('jee', cls, activeYear)
                          }}
                          className="p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-600 transition-all duration-200"
                        >
                          <div className="text-xl font-bold">{cls}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Batches List for JEE */}
                {activeYear && activeStudyTab === 'jee' && showBatchesList && activeJeeClass && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <button
                      onClick={() => {
                        setShowBatchesList(false)
                        setActiveJeeClass(null)
                        setBatches([])
                      }}
                      className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mb-4 transition-colors"
                    >
                      <FaArrowLeft />
                      <span>Back to Classes</span>
                    </button>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                      JEE - {activeJeeClass} Batches
                    </h3>
                    
                    {loading ? (
                      <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading batches...</p>
                      </div>
                    ) : batches.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {batches.map((batch) => (
                          <div
                            key={batch.id}
                            className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-gray-100 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500"
                          >
                            <div className="relative overflow-hidden">
                              {batch.image_url && (
                                <img 
                                  src={batch.image_url} 
                                  alt={batch.title}
                                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            </div>
                            <div className="p-5">
                              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">{batch.title}</h4>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => enrollInBatch(batch.id)}
                                  disabled={isBatchEnrolled(batch.id)}
                                  className={`flex-1 font-bold py-2.5 px-4 rounded-lg transition-all duration-200 ${
                                    isBatchEnrolled(batch.id)
                                      ? 'bg-green-600 text-white cursor-not-allowed'
                                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg'
                                  }`}
                                >
                                  {isBatchEnrolled(batch.id) ? '✓ Enrolled' : 'Enroll'}
                                </button>
                                <a
                                  href={batch.telegram_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-2.5 px-4 rounded-lg transition-all duration-200 text-center shadow-md hover:shadow-lg"
                                >
                                  Join Batch
                                </a>
                              </div>
                            </div>
                            {isBatchEnrolled(batch.id) && (
                              <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                ✓ ENROLLED
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 p-8 rounded-lg text-center">
                        <p className="text-gray-600 dark:text-gray-300 text-lg">No batches available yet for JEE {activeJeeClass}.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Class Selection for NEET */}
                {activeYear && activeStudyTab === 'neet' && !showBatchesList && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                      <FaMedkit className="mr-3 text-indigo-600" />
                      NEET Preparation
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Select your level to view batches</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {competitiveClasses.map((cls) => (
                        <button
                          key={cls}
                          onClick={() => {
                            setActiveNeetClass(cls)
                            setShowBatchesList(true)
                            fetchBatches('neet', cls, activeYear)
                          }}
                          className="p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-600 transition-all duration-200"
                        >
                          <div className="text-xl font-bold">{cls}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Batches List for NEET */}
                {activeYear && activeStudyTab === 'neet' && showBatchesList && activeNeetClass && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <button
                      onClick={() => {
                        setShowBatchesList(false)
                        setActiveNeetClass(null)
                        setBatches([])
                      }}
                      className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mb-4 transition-colors"
                    >
                      <FaArrowLeft />
                      <span>Back to Classes</span>
                    </button>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                      NEET - {activeNeetClass} Batches
                    </h3>
                    
                    {loading ? (
                      <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading batches...</p>
                      </div>
                    ) : batches.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {batches.map((batch) => (
                          <div
                            key={batch.id}
                            className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-gray-100 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500"
                          >
                            <div className="relative overflow-hidden">
                              {batch.image_url && (
                                <img 
                                  src={batch.image_url} 
                                  alt={batch.title}
                                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            </div>
                            <div className="p-5">
                              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">{batch.title}</h4>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => enrollInBatch(batch.id)}
                                  disabled={isBatchEnrolled(batch.id)}
                                  className={`flex-1 font-bold py-2.5 px-4 rounded-lg transition-all duration-200 ${
                                    isBatchEnrolled(batch.id)
                                      ? 'bg-green-600 text-white cursor-not-allowed'
                                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg'
                                  }`}
                                >
                                  {isBatchEnrolled(batch.id) ? '✓ Enrolled' : 'Enroll'}
                                </button>
                                <a
                                  href={batch.telegram_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-2.5 px-4 rounded-lg transition-all duration-200 text-center shadow-md hover:shadow-lg"
                                >
                                  Join Batch
                                </a>
                              </div>
                            </div>
                            {isBatchEnrolled(batch.id) && (
                              <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                ✓ ENROLLED
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 p-8 rounded-lg text-center">
                        <p className="text-gray-600 dark:text-gray-300 text-lg">No batches available yet for NEET {activeNeetClass}.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Class Selection for Khazana */}
                {activeYear && activeStudyTab === 'khazana' && !showBatchesList && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                      <FaGraduationCap className="mr-3 text-indigo-600" />
                      Khazana - Premium Content
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Select your class to access premium study materials</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {khazanaClasses.map((cls) => (
                        <button
                          key={cls}
                          onClick={() => {
                            setActiveKhazanaClass(cls)
                            setShowBatchesList(true)
                            fetchBatches('khazana', cls, activeYear)
                          }}
                          className="p-6 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-gray-600 transition-all duration-200"
                        >
                          <div className="text-xl font-bold">{cls}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Batches List for Khazana */}
                {activeYear && activeStudyTab === 'khazana' && showBatchesList && activeKhazanaClass && (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    <button
                      onClick={() => {
                        setShowBatchesList(false)
                        setActiveKhazanaClass(null)
                        setBatches([])
                      }}
                      className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mb-4 transition-colors"
                    >
                      <FaArrowLeft />
                      <span>Back to Classes</span>
                    </button>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                      Khazana - {activeKhazanaClass} Batches
                    </h3>
                    
                    {loading ? (
                      <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading batches...</p>
                      </div>
                    ) : batches.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {batches.map((batch) => (
                          <div
                            key={batch.id}
                            className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-gray-100 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500"
                          >
                            <div className="relative overflow-hidden">
                              {batch.image_url && (
                                <img 
                                  src={batch.image_url} 
                                  alt={batch.title}
                                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                            </div>
                            <div className="p-5">
                              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">{batch.title}</h4>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => enrollInBatch(batch.id)}
                                  disabled={isBatchEnrolled(batch.id)}
                                  className={`flex-1 font-bold py-2.5 px-4 rounded-lg transition-all duration-200 ${
                                    isBatchEnrolled(batch.id)
                                      ? 'bg-green-600 text-white cursor-not-allowed'
                                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-md hover:shadow-lg'
                                  }`}
                                >
                                  {isBatchEnrolled(batch.id) ? '✓ Enrolled' : 'Enroll'}
                                </button>
                                <a
                                  href={batch.telegram_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-2.5 px-4 rounded-lg transition-all duration-200 text-center shadow-md hover:shadow-lg"
                                >
                                  Join Batch
                                </a>
                              </div>
                            </div>
                            {isBatchEnrolled(batch.id) && (
                              <div className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                ✓ ENROLLED
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 p-8 rounded-lg text-center">
                        <p className="text-gray-600 dark:text-gray-300 text-lg">No batches available yet for Khazana {activeKhazanaClass}.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                  <FaPhone className="mr-3 text-indigo-600" />
                  Contact
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Get in touch with us for any queries or support.</p>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Email</h3>
                    <p className="text-gray-600 dark:text-gray-400">support@eduplatform.com</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Phone</h3>
                    <p className="text-gray-600 dark:text-gray-400">+91 1234567890</p>
                  </div>
                </div>
              </div>
            )}

            {/* Bot Tab */}
            {activeTab === 'bot' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                  <FaRobot className="mr-3 text-indigo-600" />
                  AI Bot Assistant
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Chat with our AI assistant for instant help and guidance!</p>
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300">🤖 Bot feature coming soon! Get ready for 24/7 AI-powered assistance.</p>
                </div>
              </div>
            )}

            {/* YouTube Tab */}
            {activeTab === 'youtube' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                  <FaYoutube className="mr-3 text-red-600" />
                  YouTube Channel
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Subscribe to our YouTube channel for video lectures and tutorials!</p>
                <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300">📺 Visit our channel for free educational content and live sessions!</p>
                </div>
              </div>
            )}

            {/* WhatsApp Tab */}
            {activeTab === 'whatsapp' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                  <FaWhatsapp className="mr-3 text-green-600" />
                  WhatsApp Channel
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Join our WhatsApp channel for instant updates and announcements!</p>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 p-6 rounded-lg">
                  <p className="text-gray-700 dark:text-gray-300">💬 Stay connected with daily updates, study tips, and important notifications!</p>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* Telegram Popup */}
      <div id="telegramPopup" className="popup">
        <div className="popup-content popup-square">
          <span id="popupClose" className="popup-close">×</span>
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" 
            alt="Telegram Icon" 
            width={64}
            height={64}
            className="telegram-icon"
          />
          <h2>Join Our Telegram Channels!</h2>
          <p>Stay updated with latest content!</p>
          <div className="telegram-buttons">
            <a href="https://t.me/genius_hub_official_01" target="_blank" className="telegram-btn telegram-btn-official">
              📚 Geniushub Official
            </a>
            <a href="https://t.me/Sigma_Boy_Ji/19" target="_blank" className="telegram-btn telegram-btn-books">
              📖 SIGMA LIFE
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
