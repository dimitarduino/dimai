"use client"
import React, { useState, useEffect } from 'react'
import { Plus, Trash2, MessageSquare, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUser } from '@clerk/nextjs'
import axios from 'axios'
import { toast } from 'sonner'

function ChatSidebar({ 
  conversations, 
  currentConversationId, 
  onSelectConversation, 
  onNewChat,
  onDeleteConversation,
  isLoading 
}) {
  const [hoveredId, setHoveredId] = useState(null)

  const formatDate = (dateString) => {
    if (!dateString) return ''
    
    try {
      const date = new Date(dateString)
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return ''
      }
      
      const now = new Date()
      const diffTime = Math.abs(now - date)
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 0) return 'Today'
      if (diffDays === 1) return 'Yesterday'
      if (diffDays < 7) return `${diffDays} days ago`
      return date.toLocaleDateString()
    } catch (error) {
      return ''
    }
  }

  const truncateTitle = (title, maxLength = 30) => {
    if (title.length <= maxLength) return title
    return title.substring(0, maxLength) + '...'
  }

  return (
    <div className="w-64 h-full bg-white dark:bg-zinc-950 border-r border-neutral-200 dark:border-neutral-800 flex flex-col shadow-lg md:shadow-none">
      {/* New Chat Button */}
      <div className="p-3 border-b border-neutral-200 dark:border-neutral-800">
        <Button
          onClick={onNewChat}
          className="w-full cursor-pointer justify-start gap-2"
          variant="outline"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
          </div>
        ) : conversations.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No conversations yet</p>
            <p className="text-xs mt-1">Start a new chat to begin</p>
          </div>
        ) : (
          <div className="p-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`group relative mb-1 rounded-lg p-2 cursor-pointer transition-colors ${
                  currentConversationId === conversation.id
                    ? 'bg-primary/10 dark:bg-primary/20'
                    : 'hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`}
                onMouseEnter={() => setHoveredId(conversation.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-primary flex-shrink-0" />
                      <p className="text-sm font-medium truncate text-neutral-900 dark:text-neutral-100">
                        {truncateTitle(conversation.title)}
                      </p>
                    </div>
                    {hoveredId === conversation.id && formatDate(conversation.updatedAt) && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatDate(conversation.updatedAt)}
                      </p>
                    )}
                  </div>
                  {hoveredId === conversation.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteConversation(conversation.id)
                      }}
                      className="opacity-70 hover:opacity-100 text-red-500 hover:text-red-600 transition-opacity flex-shrink-0"
                      title="Delete conversation"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatSidebar

