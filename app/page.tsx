'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, Mic, Plus, Menu, X, Sprout, AlertTriangle, Leaf, Droplets, Sun, Camera, Image as ImageIcon } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
  image?: string
}

function AgriChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      text: "Hello! I'm AgriChat, your AI farming companion. I can analyze Sentinel-2 satellite data for crop health insights, or you can upload a photo of your wheat/crops and I'll help diagnose any issues!",
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setSelectedImage(base64String)
        setImagePreview(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const clearImage = () => {
    setSelectedImage(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Send message to FastAPI backend
  const handleSendMessage = async (text: string = inputValue) => {
    if (!text.trim() && !selectedImage) return

    const messageText = text.trim() || "What do you see in this image?"
    console.log('Sending message:', messageText, 'Image:', !!selectedImage)

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
      image: imagePreview || undefined,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    const imageToSend = selectedImage
    clearImage()
    setIsLoading(true)

    try {
      const response = await fetch('http://127.0.0.1:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: messageText,
          image: imageToSend
        }),
      })
      console.log('Received response status:', response.status)
      const data = await response.json()

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply,
        sender: 'bot',
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error('Error fetching bot response:', error)
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "Sorry, I couldn't reach the server. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const suggestedQuestions = [
    'How is the crop health for Field_1?',
    'What is the NDVI on 2024-01-29?',
    'Should I irrigate today?',
    'Show me the field report analysis.',
  ]

  return (
    <div className="flex h-screen bg-stone-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-stone-200 transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-lg font-semibold text-stone-900">AgriChat</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-stone-900 hover:text-emerald-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <button className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors mb-4 font-medium">
            <Plus className="w-4 h-4" />
            New Analysis
          </button>

          <div className="flex-1 overflow-y-auto space-y-2">
            <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide px-2 py-2">
              Recent Reports
            </p>
            <button className="w-full text-left px-3 py-2 text-sm text-stone-900 hover:bg-stone-100 rounded-lg transition-colors truncate flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-500" />
              Field_1 Status
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-stone-900 hover:bg-stone-100 rounded-lg transition-colors truncate flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-400" />
              Irrigation Plan
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-stone-900 hover:bg-stone-100 rounded-lg transition-colors truncate flex items-center gap-2">
              <Sun className="w-4 h-4 text-amber-500" />
              Weather Alert
            </button>
          </div>

          <div className="pt-4 border-t border-stone-200 space-y-2">
            <button className="w-full text-left px-3 py-2 text-sm text-stone-900 hover:bg-stone-100 rounded-lg transition-colors">
              Settings
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-stone-900 hover:bg-stone-100 rounded-lg transition-colors">
              Help & Support
            </button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-stone-200 bg-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-stone-900 hover:text-emerald-600 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="font-semibold text-stone-900">Field Assistant</h2>
              <p className="text-xs text-stone-500">
                Powered by Sentinel-2 Satellite Data
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-amber-50 rounded-full border border-amber-100">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span className="text-xs text-stone-900 font-medium">
              Validate with onsite inspection
            </span>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
          {messages.length === 1 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sprout className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-stone-900 mb-2">
                  Welcome, Farmer!
                </h3>
                <p className="text-sm text-stone-600 mb-6">
                  I can analyze your crop health using satellite imagery or examine photos of your wheat. What would you like to check today?
                </p>
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
                    Suggested Actions:
                  </p>
                  <div className="grid gap-2">
                    {suggestedQuestions.map((question) => (
                      <button
                        key={question}
                        onClick={() => handleSendMessage(question)}
                        className="text-left p-3 bg-white border border-stone-200 rounded-lg hover:border-emerald-600 hover:bg-emerald-50 transition-all text-sm text-stone-900 font-medium"
                      >
                        {question}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-3 rounded-lg ${message.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-none'
                    : 'bg-white border border-stone-200 text-stone-900 rounded-bl-none shadow-sm'
                  }`}
              >
                {message.image && (
                  <img
                    src={message.image}
                    alt="Uploaded crop"
                    className="rounded-lg mb-2 max-w-full h-auto"
                  />
                )}
                {message.sender === 'user' ? (
                  <p className="text-sm leading-relaxed">{message.text}</p>
                ) : (
                  <div className="text-sm leading-relaxed prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-headings:text-stone-900 prose-strong:text-stone-900 text-stone-800">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.text}
                    </ReactMarkdown>
                  </div>
                )}

                <p
                  className={`text-[10px] mt-1 text-right ${message.sender === 'user' ? 'text-emerald-100' : 'text-stone-400'
                    }`}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white border border-stone-200 rounded-lg rounded-bl-none px-4 py-3 shadow-sm">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-stone-200 bg-white p-4">
          <div className="max-w-4xl mx-auto">
            {imagePreview && (
              <div className="mb-3 relative inline-block">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-20 rounded-lg border-2 border-emerald-500"
                />
                <button
                  onClick={clearImage}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-shrink-0 p-3 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200 transition-colors flex items-center justify-center"
                title="Upload crop photo"
              >
                <Camera className="w-5 h-5" />
              </button>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                placeholder={selectedImage ? "Describe what you want to know..." : "Ask about your field (e.g., 'NDVI for Field_1')"}
                className="flex-1 px-4 py-3 bg-stone-50 border border-stone-200 rounded-lg text-stone-900 placeholder-stone-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-colors"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={(!inputValue.trim() && !selectedImage) || isLoading}
                className="flex-shrink-0 p-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-sm"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <div className="mt-2 text-center">
              <p className="text-[10px] text-stone-400">
                AgriChat may produce inaccurate information. Always validate with field inspection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AgriChat
