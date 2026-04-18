import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { ChatCircleDots, X, PaperPlaneTilt, Robot, User } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Supplement, SupplementCombination } from '@/lib/types'
import { cn } from '@/lib/utils'
import { BackendService } from '@/lib/backend-service'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface ChatbotProps {
  supplements: Supplement[]
  combinations: SupplementCombination[]
  onSupplementSelect?: (supplement: Supplement) => void
}

export function Chatbot({ supplements, combinations, onSupplementSelect }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await generateResponse(userMessage.content, supplements, combinations)
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm having trouble processing your request right now. Please try again.",
        timestamp: Date.now()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[400px] max-w-[calc(100vw-3rem)]"
          >
            <Card className="flex flex-col h-[600px] max-h-[80vh] shadow-2xl border-2">
              <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary to-accent text-primary-foreground">
                <div className="flex items-center gap-3">
                  <Robot weight="duotone" className="w-6 h-6" />
                  <div>
                    <h3 className="font-semibold">TrendPulse AI</h3>
                    <p className="text-xs opacity-90">Ask me about supplements</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="h-8 w-8 p-0 hover:bg-primary-foreground/20"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                <div className="space-y-4">
                  {messages.length === 0 && (
                    <div className="text-center py-8 space-y-4">
                      <Robot weight="duotone" className="w-16 h-16 mx-auto text-muted-foreground opacity-50" />
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          👋 Hi! I'm your supplement trend assistant.
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Try asking me:
                        </p>
                        <div className="space-y-1 text-xs text-left max-w-xs mx-auto">
                          <div className="bg-muted/50 rounded-lg p-2">
                            "Show me peptides for muscle recovery"
                          </div>
                          <div className="bg-muted/50 rounded-lg p-2">
                            "What's trending in nootropics?"
                          </div>
                          <div className="bg-muted/50 rounded-lg p-2">
                            "Find supplements for better sleep"
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={cn(
                        'flex gap-3',
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {message.role === 'assistant' && (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                          <Robot weight="duotone" className="w-5 h-5 text-primary-foreground" />
                        </div>
                      )}
                      <div
                        className={cn(
                          'rounded-2xl px-4 py-2 max-w-[80%]',
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground rounded-br-sm'
                            : 'bg-muted text-foreground rounded-bl-sm'
                        )}
                      >
                        {message.role === 'assistant' ? (
                          <div className="prose prose-sm max-w-none text-sm prose-p:my-1 prose-headings:my-2 prose-ul:my-1 prose-ol:my-1 prose-li:my-0 prose-pre:my-2 prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground prose-code:text-foreground">
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                          </div>
                        ) : (
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        )}
                      </div>
                      {message.role === 'user' && (
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                          <User weight="duotone" className="w-5 h-5 text-secondary-foreground" />
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-3"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                        <Robot weight="duotone" className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>

              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about supplements..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    size="icon"
                    className="gap-2"
                  >
                    <PaperPlaneTilt weight="fill" className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="fixed bottom-6 right-6 z-50"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-br from-primary to-accent hover:shadow-xl transition-shadow"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <ChatCircleDots weight="duotone" className="w-6 h-6" />
          )}
        </Button>
      </motion.div>
    </>
  )
}

async function generateResponse(
  query: string,
  supplements: Supplement[],
  combinations: SupplementCombination[]
): Promise<string> {
  const lowerQuery = query.toLowerCase()

  if (lowerQuery.includes('peptide')) {
    const peptides = supplements.filter(s => s.category === 'peptide')
    if (peptides.length === 0) return "I don't have any peptide data available right now."
    
    const top3 = peptides.slice(0, 3)
    let response = "Here are the top trending peptides:\n\n"
    top3.forEach((p, i) => {
      response += `${i + 1}. **${p.name}** (${p.trendDirection})\n${p.description.substring(0, 100)}...\n\n`
    })
    return response + "Would you like to know more about any of these?"
  }

  if (lowerQuery.includes('nootropic') || lowerQuery.includes('cognitive') || lowerQuery.includes('brain')) {
    const nootropics = supplements.filter(s => s.category === 'nootropic')
    if (nootropics.length === 0) return "I don't have any nootropic data available right now."
    
    const top3 = nootropics.slice(0, 3)
    let response = "Here are the top trending nootropics for cognitive enhancement:\n\n"
    top3.forEach((p, i) => {
      response += `${i + 1}. **${p.name}** (${p.trendDirection})\n${p.description.substring(0, 100)}...\n\n`
    })
    return response + "These are popular for focus, memory, and mental clarity."
  }

  if (lowerQuery.includes('rising') || lowerQuery.includes('trending')) {
    const rising = supplements.filter(s => s.trendDirection === 'rising').slice(0, 5)
    if (rising.length === 0) return "No rising trends detected at the moment."
    
    let response = "🚀 Currently rising supplements:\n\n"
    rising.forEach((s, i) => {
      response += `${i + 1}. **${s.name}** - ${s.description.substring(0, 80)}...\n\n`
    })
    return response
  }

  if (lowerQuery.includes('stack') || lowerQuery.includes('combination')) {
    const top3Combos = combinations.slice(0, 3)
    if (top3Combos.length === 0) return "I don't have any stack data available right now."
    
    let response = "Popular supplement stacks:\n\n"
    top3Combos.forEach((c, i) => {
      response += `${i + 1}. **${c.name}**\n${c.purpose}\n\n`
    })
    return response
  }

  if (lowerQuery.includes('sleep') || lowerQuery.includes('rest')) {
    const sleepSupps = supplements.filter(s => 
      s.description.toLowerCase().includes('sleep') || 
      s.description.toLowerCase().includes('rest') ||
      s.name.toLowerCase().includes('magnesium') ||
      s.name.toLowerCase().includes('glycine')
    )
    
    if (sleepSupps.length === 0) {
      return "While I don't have specific sleep supplements in the current data, common options include Magnesium Glycinate, L-Theanine, and Glycine. Try searching for these specifically!"
    }
    
    let response = "Supplements that may help with sleep:\n\n"
    sleepSupps.slice(0, 3).forEach((s, i) => {
      response += `${i + 1}. **${s.name}**\n${s.description.substring(0, 100)}...\n\n`
    })
    return response
  }

  const prompt = spark.llmPrompt`You are a helpful supplement trend assistant. Based on this user query: "${query}"

Available supplements: ${supplements.slice(0, 10).map(s => `${s.name} (${s.category}, ${s.trendDirection}): ${s.description.substring(0, 100)}`).join('\n')}

Provide a helpful, concise response (3-4 sentences max) about relevant supplements or trends. Be conversational and helpful.`

  try {
    const response = await spark.llm(prompt, 'gpt-4o-mini')
    return response
  } catch (error) {
    return "I can help you explore supplements! Try asking about specific categories like 'peptides' or 'nootropics', or ask what's trending right now."
  }
}
