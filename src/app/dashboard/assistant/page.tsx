
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Bot, Send, User } from 'lucide-react';
import { codingAssistant } from '@/ai/flows/coding-assistant-flow';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

type Message = {
    role: 'user' | 'assistant';
    content: string;
};

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to the bottom when a new message is added
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({
            top: scrollAreaRef.current.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [messages, isLoading]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const result = await codingAssistant({ query: input });
      const assistantMessage: Message = { role: 'assistant', content: result.response };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('AI Assistant error:', error);
      toast({
        title: 'Error',
        description: 'Failed to get a response from the AI assistant.',
        variant: 'destructive',
      });
      setMessages(prev => prev.slice(0, -1)); // Remove the user message if AI fails
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)]">
        <div className="mb-4">
            <h1 className="text-3xl font-bold tracking-tight">AI Coding Assistant</h1>
            <p className="text-muted-foreground">Your personal AI-powered helper for all your coding questions.</p>
        </div>

        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
             <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
                 <div className="space-y-6">
                    {messages.length === 0 && !isLoading && (
                        <div className="text-center text-muted-foreground pt-16">
                            <Bot className="mx-auto h-12 w-12 mb-4" />
                            <p>Ask me anything about coding!</p>
                        </div>
                    )}
                    {messages.map((message, index) => (
                        <div key={index} className={cn("flex items-start gap-4", message.role === 'user' ? 'justify-end' : '')}>
                             {message.role === 'assistant' && (
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
                                </Avatar>
                             )}
                            <div className={cn(
                                "max-w-xl rounded-lg p-3",
                                message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                            )}>
                                <ReactMarkdown
                                    className="prose dark:prose-invert max-w-none"
                                    remarkPlugins={[remarkGfm]}
                                    components={{
                                        code({node, inline, className, children, ...props}) {
                                            const match = /language-(\w+)/.exec(className || '')
                                            return !inline && match ? (
                                            <div className="relative">
                                                <pre className="p-4 bg-background/50 rounded-md overflow-x-auto text-foreground"><code className={className} {...props}>{children}</code></pre>
                                            </div>
                                            ) : (
                                            <code className="bg-background/50 text-foreground px-1 rounded-sm" {...props}>{children}</code>
                                            )
                                        }
                                    }}
                                >
                                    {message.content}
                                </ReactMarkdown>
                            </div>
                             {message.role === 'user' && (
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
                                </Avatar>
                             )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-start gap-4">
                            <Avatar className="h-8 w-8">
                               <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
                            </Avatar>
                            <div className="max-w-xl rounded-lg p-3 bg-muted space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-5/6" />
                            </div>
                        </div>
                    )}
                 </div>
            </ScrollArea>
        </div>

        <div className="mt-4 border-t pt-4">
            <form onSubmit={handleSubmit} className="relative">
                <Textarea
                    placeholder="Ask a question or paste some code..."
                    className="min-h-12 pr-16"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit();
                        }
                    }}
                    disabled={isLoading}
                />
                <Button 
                    type="submit" 
                    size="icon" 
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    disabled={isLoading || !input.trim()}
                >
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </div>
    </div>
  );
}
