"use client"
import React, { useState, useRef, useEffect, useCallback, useContext } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Send, Bot, User, Loader2, Square, Image as ImageIcon, Search, FileSearch, FileText, Upload, ChevronDown, Copy, Check, X } from 'lucide-react'
import { toast } from 'sonner'
import axios from 'axios'
import { useUser } from '@clerk/nextjs'
import { useDropzone } from 'react-dropzone'
import { storage } from 'configs/Firebase'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import Image from 'next/image'
import ChatSidebar from '../_components/ChatSidebar'
import { MobileNavContext } from '../layout'

const AVAILABLE_MODELS = [
  { value: 'openai/gpt-4o-mini', label: 'GPT-4o-mini', description: 'Mini model', supportsVision: false, supportsDocuments: false },
  { value: 'openai/gpt-5-nano', label: 'GPT-5-nano', description: 'Smallest model', supportsVision: false, supportsDocuments: false },
  { value: 'openai/gpt-5-mini', label: 'GPT-5-mini', description: 'Small model', supportsVision: false, supportsDocuments: false },
  { value: 'openai/gpt-5-micro', label: 'GPT-5-micro', description: 'Medium model', supportsVision: false, supportsDocuments: false },
  { value: 'openai/gpt-5-small', label: 'GPT-5-small', description: 'Large model', supportsVision: false, supportsDocuments: false },
  { value: 'openai/gpt-4o', label: 'GPT-4o', description: 'Vision & Document capable', supportsVision: true, supportsDocuments: true },
  { value: 'openai/gpt-4-vision', label: 'GPT-4 Vision', description: 'Vision model', supportsVision: true, supportsDocuments: false },
  { value: 'openai/gpt-4-turbo', label: 'GPT-4 Turbo', description: 'Document capable', supportsVision: false, supportsDocuments: true },
]

const IMAGE_GENERATION_MODEL = 'bytedance/sdxl-lightning-4step:6f7a773af6fc3e8de9d5a3c00be77c17308914bf67772726aff83496ba1e3bbe'

function ChatPage() {
  const { user } = useUser()
  const searchParams = useSearchParams()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [selectedModel, setSelectedModel] = useState('openai/gpt-5-nano')
  const [isLoading, setIsLoading] = useState(false)
  const [conversations, setConversations] = useState([])
  const [currentConversationId, setCurrentConversationId] = useState(null)
  const [isLoadingConversations, setIsLoadingConversations] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [streamingMessageId, setStreamingMessageId] = useState(null)
  const [uploadedImages, setUploadedImages] = useState([])
  const [uploadedDocuments, setUploadedDocuments] = useState([])
  const [isUploadingImages, setIsUploadingImages] = useState(false)
  const [isUploadingDocuments, setIsUploadingDocuments] = useState(false)
  const [showUploadMenu, setShowUploadMenu] = useState(false)
  const [enableWebSearch, setEnableWebSearch] = useState(false)
  const [enableResearch, setEnableResearch] = useState(false)
  const [copiedMessageId, setCopiedMessageId] = useState(null)
  const [hasAutoSubmitted, setHasAutoSubmitted] = useState(false)
  const shouldStopStreamingRef = useRef(false)
  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)
  const uploadMenuRef = useRef(null)

  const userEmail = user?.primaryEmailAddress?.emailAddress

  // Load conversations on mount
  useEffect(() => {
    if (userEmail) {
      loadConversations()
    }
  }, [userEmail])

  // Auto-submit prompt from URL query parameter
  useEffect(() => {
    const promptParam = searchParams?.get('prompt')
    if (promptParam && !hasAutoSubmitted && userEmail && !isLoadingConversations) {
      const decodedPrompt = decodeURIComponent(promptParam)
      setInput(decodedPrompt)
      setHasAutoSubmitted(true)
      
      // Wait a bit for everything to initialize, then auto-submit
      const timer = setTimeout(() => {
        if (decodedPrompt.trim()) {
          handleSend(decodedPrompt.trim())
        }
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [searchParams, userEmail, hasAutoSubmitted, isLoadingConversations])

  const loadConversations = async () => {
    if (!userEmail) return
    
    try {
      setIsLoadingConversations(true)
      const response = await axios.get(`/api/chat-conversations?email=${encodeURIComponent(userEmail)}`)
      setConversations(response.data.conversations || [])
    } catch (error) {
      console.error('Error loading conversations:', error)
      toast.error('Failed to load conversations')
    } finally {
      setIsLoadingConversations(false)
    }
  }

  // Load a specific conversation
  const loadConversation = async (conversationId) => {
    if (!userEmail) return

    try {
      const response = await axios.get(
        `/api/chat-conversation?id=${conversationId}&email=${encodeURIComponent(userEmail)}`
      )
      const conversation = response.data.conversation
      
      // Add IDs to messages if they don't have them
      const messagesWithIds = (conversation.messages || []).map((msg, idx) => ({
        ...msg,
        id: msg.id || `msg-${conversationId}-${idx}`
      }))
      
      setMessages(messagesWithIds)
      setSelectedModel(conversation.model || 'openai/gpt-5-nano')
      setCurrentConversationId(conversationId)
    } catch (error) {
      console.error('Error loading conversation:', error)
      toast.error('Failed to load conversation')
    }
  }

  // Save conversation to database
  const saveConversation = async (messagesToSave, title = null) => {
    if (!userEmail || messagesToSave.length === 0) return

    try {
      setIsSaving(true)
      const response = await axios.post('/api/chat-conversations', {
        conversationId: currentConversationId,
        title: title,
        model: selectedModel,
        messages: messagesToSave.map(msg => ({
          role: msg.role,
          content: msg.content,
          images: msg.images || [],
          image: msg.image || null,
          documents: msg.documents || [],
          citations: msg.citations || []
        })),
        email: userEmail
      })

      const savedConversation = response.data.conversation
      setCurrentConversationId(savedConversation?.id || null)
      
      // Refresh conversations list
      await loadConversations()
    } catch (error) {
      console.error('Error saving conversation:', error)
      // Don't show error toast for saving, it's not critical
    } finally {
      setIsSaving(false)
    }
  }

  // Auto-save conversation after receiving response
  useEffect(() => {
    if (messages.length > 0 && !isLoading) {
      // Debounce save to avoid too many requests
      const timeoutId = setTimeout(() => {
        saveConversation(messages)
      }, 1000)
      return () => clearTimeout(timeoutId)
    }
  }, [messages, isLoading])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      const scrollHeight = textareaRef.current.scrollHeight
      // Set minimum height to one line, max to 200px
      const minHeight = 40 // Approximate height for one line
      const maxHeight = 200
      textareaRef.current.style.height = `${Math.min(Math.max(scrollHeight, minHeight), maxHeight)}px`
    }
  }, [input])

  // Detect if user wants to generate an image
  const wantsImageGeneration = (text) => {
    const imageKeywords = ['generate image', 'create image', 'draw', 'make an image', 'generate a picture', 'create a picture', 'image of', 'picture of']
    const lowerText = text.toLowerCase()
    return imageKeywords.some(keyword => lowerText.includes(keyword))
  }

  // Auto-select appropriate model based on context
  const getAppropriateModel = (text, hasImages, hasDocuments) => {
    // If user wants to generate an image, use image generation (handled separately)
    if (wantsImageGeneration(text)) {
      return null // Signal to use image generation
    }
    
    const currentModel = AVAILABLE_MODELS.find(m => m.value === selectedModel)
    
    // Priority: Documents > Images > Default
    // If documents are uploaded, switch to document-capable model
    if (hasDocuments) {
      if (!currentModel?.supportsDocuments) {
        // Find first document-capable model (prefer one that also supports vision)
        const docModel = AVAILABLE_MODELS.find(m => m.supportsDocuments && m.supportsVision) ||
                         AVAILABLE_MODELS.find(m => m.supportsDocuments)
        if (docModel) {
          return docModel.value
        }
      }
    }
    
    // If images are uploaded, switch to vision model if current model doesn't support vision
    if (hasImages) {
      if (!currentModel?.supportsVision) {
        // Find first vision-capable model
        const visionModel = AVAILABLE_MODELS.find(m => m.supportsVision)
        if (visionModel) {
          return visionModel.value
        }
      }
    }
    
    return selectedModel
  }

  const handleSend = async (promptText = null) => {
    console.log(promptText);
    const textToSend = promptText !== null ? promptText : input.trim()
    if ((!textToSend && uploadedImages.length === 0 && uploadedDocuments.length === 0) || isLoading) return

    const hasImages = uploadedImages.length > 0
    const hasDocuments = uploadedDocuments.length > 0

    console.log(textToSend)
    const appropriateModel = getAppropriateModel(textToSend, hasImages, hasDocuments)
    
    // Handle image generation
    if (appropriateModel === null && wantsImageGeneration(textToSend)) {
      await handleImageGeneration(textToSend)
      return
    }

    // Notify user if model was auto-switched
    if ((hasImages || hasDocuments) && appropriateModel !== selectedModel) {
      const newModel = AVAILABLE_MODELS.find(m => m.value === appropriateModel)
      if (newModel) {
        if (hasDocuments) {
          toast.info(`Switched to ${newModel.label} for document analysis`)
        } else if (hasImages) {
          toast.info(`Switched to ${newModel.label} for image analysis`)
        }
        setSelectedModel(appropriateModel)
      }
    }

    // Upload images to Firebase if any
    let imageUrls = []
    if (hasImages) {
      setIsUploadingImages(true)
      try {
        imageUrls = await uploadImagesToFirebase(uploadedImages)
      } catch (error) {
        toast.error('Failed to upload images')
        setIsUploadingImages(false)
        return
      }
      setIsUploadingImages(false)
    }

    // Process documents if any
    let documentContents = []
    if (hasDocuments) {
      setIsUploadingDocuments(true)
      try {
        documentContents = await processDocuments(uploadedDocuments)
        
        // Check if any documents failed to extract text
        const failedDocs = documentContents.filter(doc => 
          doc.text && doc.text.includes('[Document uploaded but text extraction failed')
        )
        
        if (failedDocs.length > 0) {
          toast.warning(`Some documents (${failedDocs.length}) had extraction issues but were uploaded successfully`)
        } else if (documentContents.length > 0) {
          toast.success(`Successfully processed ${documentContents.length} document(s)`)
        }
      } catch (error) {
        console.error('Document processing error:', error)
        toast.error(`Failed to process documents: ${error.response?.data?.error || error.message}`)
        setIsUploadingDocuments(false)
        return
      }
      setIsUploadingDocuments(false)
    }

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      images: imageUrls,
      documents: documentContents,
      timestamp: new Date()
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    if (promptText === null) {
      setInput('')
    }
    setUploadedImages([])
    setUploadedDocuments([])
    setIsLoading(true)
    setIsGenerating(true)

    // Use appropriate model (may have been auto-switched)
    const modelToUse = appropriateModel || selectedModel

    // Add placeholder assistant message for generating state
    const newStreamingMessageId = Date.now()
    const placeholderMessage = {
      id: newStreamingMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isGenerating: true
    }
    setMessages([...updatedMessages, placeholderMessage])
    setStreamingMessageId(newStreamingMessageId)
    shouldStopStreamingRef.current = false

    try {
      // Perform web search if enabled
      let searchResults = null
      if (enableWebSearch || enableResearch) {
        try {
          const searchResponse = await axios.post('/api/web-search', {
            query: textToSend,
            deepResearch: enableResearch
          })
          searchResults = searchResponse.data
        } catch (searchError) {
          console.error('Search error:', searchError)
          // Continue without search results
        }
      }

      // Send all messages including history for context
      const messagesForAPI = promptText !== null 
        ? [...messages, userMessage] 
        : updatedMessages
      
      const response = await axios.post('/api/chat', {
        model: modelToUse,
        messages: messagesForAPI.map(msg => ({
          role: msg.role,
          content: msg.content,
          images: msg.images || [],
          documents: msg.documents || []
        })),
        searchResults: searchResults,
        enableWebSearch: enableWebSearch || enableResearch
      })

      const fullResponse = response.data.response || response.data.output || 'No response received'
      const citations = response.data.citations || []
      
      // Update message to show search status if applicable
      if (enableWebSearch || enableResearch) {
        setMessages(prev => prev.map(msg => 
          msg.id === newStreamingMessageId 
            ? { 
                ...msg, 
                isGenerating: false, 
                isStreaming: true,
                isSearching: enableWebSearch || enableResearch
              }
            : msg
        ))
      } else {
        setIsGenerating(false)
        setIsStreaming(true)
        setMessages(prev => prev.map(msg => 
          msg.id === newStreamingMessageId 
            ? { ...msg, isGenerating: false, isStreaming: true }
            : msg
        ))
      }
      
      // Simulate typing effect by streaming the response
      await streamResponse(fullResponse, newStreamingMessageId)
      
      if (!shouldStopStreamingRef.current) {
        // Update the message to remove streaming flag and add citations
        setMessages(prev => prev.map(msg => 
          msg.id === newStreamingMessageId 
            ? { ...msg, content: fullResponse, isStreaming: false, citations: citations }
            : msg
        ))

        const finalMessages = [...updatedMessages, {
          role: 'assistant',
          content: fullResponse,
          citations: citations,
          timestamp: new Date()
        }]

        // Save conversation after getting response
        await saveConversation(finalMessages)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error(error.response?.data?.error || 'Failed to get response. Please try again.')
      
      // Remove streaming message and add error message
      setMessages(prev => prev.filter(msg => msg.id !== newStreamingMessageId))
      
      const errorMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
        isError: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setIsStreaming(false)
      setIsGenerating(false)
      setStreamingMessageId(null)
      shouldStopStreamingRef.current = false
      
      // Auto-focus input after generation ends
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus()
        }
      }, 100)
    }
  }

  const handleImageGeneration = async (prompt) => {
    setIsLoading(true)
    setIsGenerating(true)
    
    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: prompt,
      timestamp: new Date()
    }

    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setUploadedImages([])

    const newStreamingMessageId = Date.now()
    const placeholderMessage = {
      id: newStreamingMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isGenerating: true
    }
    setMessages([...updatedMessages, placeholderMessage])
    setStreamingMessageId(newStreamingMessageId)

    try {
      const response = await axios.post('/api/generate-image', {
        prompt: prompt
      })

      const imageUrl = response.data.result
      
      const assistantMessage = {
        id: newStreamingMessageId,
        role: 'assistant',
        content: `Generated image based on: "${prompt}"`,
        image: imageUrl,
        timestamp: new Date()
      }

      setMessages(prev => prev.map(msg => 
        msg.id === newStreamingMessageId ? assistantMessage : msg
      ))

      const finalMessages = [...updatedMessages, assistantMessage]
      await saveConversation(finalMessages)
      
      toast.success('Image generated successfully!')
    } catch (error) {
      console.error('Error generating image:', error)
      toast.error('Failed to generate image')
      
      setMessages(prev => prev.filter(msg => msg.id !== newStreamingMessageId))
      
      const errorMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: 'Sorry, I encountered an error generating the image. Please try again.',
        timestamp: new Date(),
        isError: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setIsGenerating(false)
      setStreamingMessageId(null)
      
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus()
        }
      }, 100)
    }
  }

  const uploadImagesToFirebase = async (images) => {
    const uploadPromises = images.map(async (image) => {
      const storageRef = ref(storage, `chat-images/${Date.now()}-${image.name}`)
      const uploadTask = uploadBytesResumable(storageRef, image)
      
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          null,
          (error) => reject(error),
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref)
            resolve(url)
          }
        )
      })
    })
    
    return Promise.all(uploadPromises)
  }

  const processDocuments = async (documents) => {
    const formData = new FormData()
    documents.forEach((doc) => {
      formData.append('documents', doc)
    })

    try {
      const response = await axios.post('/api/process-document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 60000 // 60 second timeout for large documents
      })

      if (!response.data || !response.data.documents) {
        throw new Error('Invalid response from document processing API')
      }

      return response.data.documents
    } catch (error) {
      console.error('Document processing error:', error)
      throw error
    }
  }

  const onDropImages = useCallback((acceptedFiles) => {
    const imageFiles = acceptedFiles.filter(file => file.type.startsWith('image/'))
    if (imageFiles.length > 0) {
      setUploadedImages(prev => [...prev, ...imageFiles])
      toast.success(`${imageFiles.length} image(s) added`)
    } else {
      toast.error('Please upload only image files')
    }
  }, [])

  const onDropDocuments = useCallback((acceptedFiles) => {
    const documentFiles = acceptedFiles.filter(file => {
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'text/markdown',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ]
      return validTypes.includes(file.type) || 
             file.name.endsWith('.pdf') || 
             file.name.endsWith('.doc') || 
             file.name.endsWith('.docx') || 
             file.name.endsWith('.txt') || 
             file.name.endsWith('.md') ||
             file.name.endsWith('.xls') ||
             file.name.endsWith('.xlsx')
    })
    
    if (documentFiles.length > 0) {
      setUploadedDocuments(prev => [...prev, ...documentFiles])
      toast.success(`${documentFiles.length} document(s) added`)
    } else {
      toast.error('Please upload valid document files (PDF, DOC, DOCX, TXT, MD, XLS, XLSX)')
    }
  }, [])

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps, isDragActive: isImageDragActive } = useDropzone({
    onDrop: onDropImages,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    multiple: true,
    noClick: true
  })

  const { getRootProps: getDocRootProps, getInputProps: getDocInputProps } = useDropzone({
    onDrop: onDropDocuments,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
      'text/markdown': ['.md'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    multiple: true,
    noClick: true
  })

  const removeImage = (index) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index))
  }

  const removeDocument = (index) => {
    setUploadedDocuments(prev => prev.filter((_, i) => i !== index))
  }

  // Close upload menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (uploadMenuRef.current && !uploadMenuRef.current.contains(event.target)) {
        setShowUploadMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const streamResponse = async (text, messageId) => {
    // Stream character by character for smoother effect
    let currentText = ''
    const chars = text.split('')
    
    for (let i = 0; i < chars.length; i++) {
      // Check if streaming should stop
      if (shouldStopStreamingRef.current) {
        // Keep the current text but mark as stopped
        setMessages(prev => prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, content: currentText, isStreaming: false }
            : msg
        ))
        return
      }
      
      currentText += chars[i]
      
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, content: currentText }
          : msg
      ))
      
      // Much faster delays for quick typing effect
      let delay = 5
      if (chars[i] === ' ') delay = 8
      else if (chars[i] === '.' || chars[i] === '!' || chars[i] === '?') delay = 15
      else if (chars[i] === ',') delay = 10
      
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }

  const handleStopGeneration = async () => {
    shouldStopStreamingRef.current = true
    setIsStreaming(false)
    setIsGenerating(false)
    setIsLoading(false)
    
    // Update the streaming message to remove streaming/generating flag and get current content
    if (streamingMessageId) {
      let stoppedContent = ''
      let currentMessages = []
      
      setMessages(prev => {
        currentMessages = prev.filter(msg => msg.id !== streamingMessageId)
        const updated = prev.map(msg => {
          if (msg.id === streamingMessageId) {
            stoppedContent = msg.content
            return { ...msg, isStreaming: false, isGenerating: false }
          }
          return msg
        })
        return updated
      })
      
      // Save the partial conversation
      if (stoppedContent) {
        const stoppedMessage = {
          role: 'assistant',
          content: stoppedContent,
          timestamp: new Date()
        }
        await saveConversation([...currentMessages, stoppedMessage])
      }
    }
    
    setStreamingMessageId(null)
    
    // Focus input after stopping
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
      }
    }, 100)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend(input.trim())
    }
  }

  const handleNewChat = () => {
    setMessages([])
    setCurrentConversationId(null)
    setInput('')
    setUploadedImages([])
    setUploadedDocuments([])
  }

  const handleSelectConversation = (conversationId) => {
    loadConversation(conversationId)
  }

  const handleDeleteConversation = async (conversationId) => {
    if (!userEmail) return

    if (!confirm('Are you sure you want to delete this conversation?')) {
      return
    }

    try {
      await axios.delete(
        `/api/chat-conversations?id=${conversationId}&email=${encodeURIComponent(userEmail)}`
      )
      
      toast.success('Conversation deleted')
      
      // If deleted conversation was current, clear it
      if (currentConversationId === conversationId) {
        handleNewChat()
      }
      
      // Refresh conversations list
      await loadConversations()
    } catch (error) {
      console.error('Error deleting conversation:', error)
      toast.error('Failed to delete conversation')
    }
  }

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return ''
    
    try {
      const date = new Date(timestamp)
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return ''
      }
      
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch (error) {
      return ''
    }
  }

  const handleCopyMessage = async (messageId, content) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedMessageId(messageId)
      toast.success('Message copied to clipboard')
      setTimeout(() => setCopiedMessageId(null), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
      toast.error('Failed to copy message')
    }
  }

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { showBottomNav, setShowBottomNav } = useContext(MobileNavContext)

  return (
    <div className="flex h-[calc(100vh-80px)] md:h-[calc(100vh-80px)] w-full relative">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:static inset-y-0 left-0 z-50 md:z-auto
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <ChatSidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          onSelectConversation={(id) => {
            handleSelectConversation(id)
            setSidebarOpen(false) // Close sidebar on mobile after selection
          }}
          onNewChat={() => {
            handleNewChat()
            setSidebarOpen(false) // Close sidebar on mobile after new chat
          }}
          onDeleteConversation={handleDeleteConversation}
          isLoading={isLoadingConversations}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Mobile Header with Menu Button */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-zinc-950">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Button>
          <h1 className="font-bold text-xl text-primary flex-1">AI Chat</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-2 sm:px-4 md:px-8 py-4 md:py-6">
          {/* Header with Model Selection - Hidden on mobile, shown on desktop */}
          <div className="hidden md:flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
            <div>
              <h1 className="font-bold text-3xl text-primary mb-2">AI Chat</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Chat with OpenAI models powered by Replicate
              </p>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto flex-wrap">
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger className="w-full sm:w-[200px]">
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_MODELS.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{model.label}</span>
                        <span className="text-xs text-gray-500">{model.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {/* Search/Research Toggles */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setEnableWebSearch(!enableWebSearch)
                    if (!enableWebSearch) setEnableResearch(false) // Disable research if enabling search
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    enableWebSearch
                      ? 'bg-primary text-white'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  }`}
                  title="Enable web search for current information"
                >
                  <Search className="w-4 h-4" />
                  <span className="hidden sm:inline">Search</span>
                </button>
                <button
                  onClick={() => {
                    setEnableResearch(!enableResearch)
                    if (!enableResearch) setEnableWebSearch(true) // Enable search when enabling research
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    enableResearch
                      ? 'bg-primary text-white'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                  }`}
                  disabled={!enableWebSearch}
                  title="Enable deep research mode"
                >
                  <FileSearch className="w-4 h-4" />
                  <span className="hidden sm:inline">Research</span>
                </button>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="space-y-1 mb-4 px-1 sm:px-2">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <Bot className="w-16 h-16 text-gray-300 dark:text-gray-700 mb-4" />
                <h2 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                  Start a conversation
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-500 max-w-md">
                  Select a model and type a message to begin chatting with AI
                </p>
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <div
                    key={message.id || index}
                    className={`group relative flex gap-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    } mb-1`}
                  >
                    {message.role === 'assistant' && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-primary" />
                      </div>
                    )}
                    <div className="relative max-w-[85%] sm:max-w-[80%] pt-5">
                      {/* Timestamp above message - visible on hover */}
                      {formatMessageTime(message.timestamp) && (
                        <div
                          className={`absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 ${
                            message.role === 'user' ? 'right-0' : 'left-0'
                          }`}
                        >
                          <span className="text-xs text-gray-400 dark:text-gray-500 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-sm px-2 py-0.5 rounded">
                            {formatMessageTime(message.timestamp)}
                          </span>
                        </div>
                      )}
                      <div
                        className={`rounded-lg px-2.5 sm:px-3 py-2 relative ${
                          message.role === 'user'
                            ? 'bg-primary text-white'
                            : message.isError
                            ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100'
                        }`}
                      >
                        {/* Copy button for assistant messages - visible on hover */}
                        {message.role === 'assistant' && message.content && !message.isGenerating && (
                          <button
                            onClick={() => handleCopyMessage(message.id || index, message.content)}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded"
                            title="Copy message"
                          >
                            {copiedMessageId === (message.id || index) ? (
                              <Check className="w-4 h-4 text-green-500" />
                            ) : (
                              <Copy className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                            )}
                          </button>
                        )}
                        {message.isGenerating ? (
                          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>
                              {message.isSearching ? (enableResearch ? 'Researching...' : 'Searching web...') : 'Generating...'}
                            </span>
                          </div>
                        ) : (
                          <>
                            {/* Display images if any */}
                            {message.images && message.images.length > 0 && (
                              <div className="flex flex-wrap gap-2 mb-2">
                                {message.images.map((imgUrl, idx) => (
                                  <div key={idx} className="relative w-32 h-32 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
                                    <Image
                                      src={imgUrl}
                                      alt={`Uploaded image ${idx + 1}`}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                ))}
                              </div>
                            )}
                            {/* Display documents if any */}
                            {message.documents && message.documents.length > 0 && (
                              <div className="flex flex-col gap-2 mb-2">
                                {message.documents.map((doc, idx) => (
                                  <div key={idx} className="flex items-center gap-2 p-2 bg-neutral-50 dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-700">
                                    <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-medium truncate">{doc.name}</p>
                                      <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {doc.pageCount ? `${doc.pageCount} pages` : 'Processed'}
                                      </p>
                                    </div>
                                    {doc.url && (
                                      <a
                                        href={doc.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-primary hover:underline"
                                      >
                                        View
                                      </a>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                            {message.image && (
                              <div className="mb-2">
                                <div className="relative w-full max-w-md rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
                                  <Image
                                    src={message.image}
                                    alt="Generated image"
                                    width={512}
                                    height={512}
                                    className="w-full h-auto"
                                  />
                                </div>
                              </div>
                            )}
                            <div className="whitespace-pre-wrap break-words text-xs sm:text-sm leading-relaxed">
                              {message.content}
                              {message.isStreaming && (
                                <span className="inline-block w-0.5 h-4 ml-1 bg-current animate-pulse align-middle">|</span>
                              )}
                            </div>
                            {/* Display citations if available */}
                            {message.citations && message.citations.length > 0 && (
                              <div className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-700">
                                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">Sources:</p>
                                <div className="flex flex-wrap gap-2">
                                  {message.citations.map((citation, idx) => (
                                    <a
                                      key={idx}
                                      href={citation.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-xs text-primary hover:underline px-2 py-1 bg-primary/10 dark:bg-primary/20 rounded"
                                    >
                                      {citation.title || citation.url}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    {message.role === 'user' && (
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>

        {/* Input Area */}
        <div className={`border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-zinc-950 px-2 sm:px-4 md:px-8 py-3 md:py-4 ${showBottomNav ? 'pb-safe md:pb-4' : 'pb-4 md:pb-4'}`}>
          <div {...getImageRootProps()} {...getDocRootProps()} className="max-w-5xl mx-auto">
            {/* Uploaded images preview */}
            {uploadedImages.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700 group">
                    <Image
                      src={URL.createObjectURL(image)}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeImage(index)
                      }}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Uploaded documents preview */}
            {uploadedDocuments.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {uploadedDocuments.map((doc, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-neutral-50 dark:bg-neutral-900 rounded border border-neutral-200 dark:border-neutral-700 group">
                    <FileText className="w-4 h-4 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{doc.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {(doc.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removeDocument(index)
                      }}
                      className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div className="flex gap-2 items-end">
              <div className="flex-1 relative">
                <input {...getImageInputProps()} style={{ display: 'none' }} />
                <input {...getDocInputProps()} style={{ display: 'none' }} />
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={(isImageDragActive || uploadedImages.length > 0) ? "Drop images here..." : uploadedDocuments.length > 0 ? "Drop documents here..." : "Type your message..."}
                  className="max-h-[120px] md:max-h-[200px] resize-none pr-10 md:pr-12 py-2 text-sm md:text-base"
                  disabled={isLoading && !isStreaming}
                />
                <div className="absolute right-1 md:right-2 bottom-1.5 md:bottom-2 flex items-center gap-1">
                  <div className="relative" ref={uploadMenuRef}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowUploadMenu(!showUploadMenu)
                      }}
                      className="p-1 md:p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded transition-colors"
                      title="Upload files"
                    >
                      <Upload className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500 dark:text-gray-400" />
                    </button>
                    {showUploadMenu && (
                      <div className="absolute bottom-full right-0 mb-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg py-1 min-w-[150px] z-50">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            const imageInput = document.querySelector('input[type="file"][accept*="image"]')
                            if (imageInput) imageInput.click()
                            setShowUploadMenu(false)
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center gap-2 text-sm"
                        >
                          <ImageIcon className="w-4 h-4" />
                          <span>Upload Image</span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation()
                            const docInput = document.querySelector('input[type="file"][accept*="pdf"], input[type="file"][accept*="doc"], input[type="file"][accept*="txt"]')
                            if (docInput) docInput.click()
                            setShowUploadMenu(false)
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center gap-2 text-sm"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Upload File</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            {isStreaming || isGenerating ? (
              <Button
                onClick={handleStopGeneration}
                variant="ghost"
                className="h-8 w-8 md:h-9 md:w-9 p-0 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 hover:text-red-600 rounded-full transition-colors flex-shrink-0"
                size="icon"
              >
                <Square className="w-3.5 h-3.5 md:w-4 md:h-4 fill-current" />
              </Button>
            ) : (
              <Button
                onClick={() => handleSend(input.trim())}
                disabled={(!input.trim() && uploadedImages.length === 0 && uploadedDocuments.length === 0) || isLoading}
                variant="ghost"
                className="h-8 w-8 md:h-9 md:w-9 p-0 hover:bg-primary/10 dark:hover:bg-primary/20 text-primary rounded-full transition-colors disabled:opacity-50 flex-shrink-0"
                size="icon"
              >
                {isLoading ? (
                  <Loader2 className="w-3.5 h-3.5 md:w-4 md:h-4 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5 md:w-4 md:h-4" />
                )}
              </Button>
            )}
            </div>
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {AVAILABLE_MODELS.find(m => m.value === selectedModel)?.label || 'Model'} • 
                
              </p>
              {isSaving && (
                <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Saving...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage
