'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { translateToEN } from '@/lib/ai'

const translateToChineseSimple = async (text: string): Promise<string> => {
  const res = await translateToEN(text)
  return `${res.zh}`
}

type Message = {
  id: number
  text: string
  isUser: boolean
}

export default function TranslationChatbot() {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, text: "Hello! I am a translation robot. Please enter a sentence in English and I will translate it into Chinese for you.", isUser: false },
  ])
  const [isTranslating, setIsTranslating] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isTranslating) return

    const userMessage: Message = { id: messages.length, text: input, isUser: true }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsTranslating(true)

    try {
      const translation = await translateToChineseSimple(input)
      const botMessage: Message = { id: messages.length + 1, text: translation, isUser: false }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Translation error:', error)
      const errorMessage: Message = { id: messages.length + 1, text: "Sorry, something wrong, please try again", isUser: false }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTranslating(false)
    }
  }

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-4">iChat Translation Robot</h1>
      <div className="flex-1 overflow-auto mb-4 border border-gray-300 rounded-md p-4">
        {messages.map(message => (
          <div key={message.id} className={`mb-2 ${message.isUser ? 'text-right' : 'text-left'}`}>
            <span className={`inline-block p-2 rounded-md ${message.isUser ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}>
              {message.text}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Please Input English words"
          disabled={isTranslating}
          className="flex-1"
        />
        <Button type="submit" disabled={isTranslating}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}

