
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Code, Wand2 } from 'lucide-react';
import { codingAssistant } from '@/ai/flows/coding-assistant-flow';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function AssistantPage() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast({
        title: 'Query is empty',
        description: 'Please enter a question or code snippet.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    setResponse('');

    try {
      const result = await codingAssistant({ query });
      setResponse(result.response);
    } catch (error) {
      console.error('AI Assistant error:', error);
      toast({
        title: 'Error',
        description: 'Failed to get a response from the AI assistant.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
       <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">AI Coding Assistant</h1>
            <p className="text-muted-foreground">Your personal AI-powered helper for all your coding questions.</p>
        </div>

        <Card>
            <form onSubmit={handleSubmit}>
                <CardHeader>
                    <CardTitle>Ask a Question</CardTitle>
                    <CardDescription>Enter your coding question, paste a code snippet to debug, or ask for a practice problem.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Textarea
                        placeholder="e.g., 'How does useState work in React?' or 'Why am I getting a 'null pointer' error in this Java code?'"
                        className="min-h-[150px] font-mono text-sm"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        disabled={isLoading}
                    />
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isLoading}>
                         <Wand2 className="mr-2 h-4 w-4" />
                        {isLoading ? 'Thinking...' : 'Ask Assistant'}
                    </Button>
                </CardFooter>
            </form>
        </Card>

        {(isLoading || response) && (
             <Card>
                <CardHeader>
                    <CardTitle>Assistant&apos;s Response</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-5/6" />
                        </div>
                    ) : (
                        <ReactMarkdown 
                            className="prose dark:prose-invert max-w-none"
                            remarkPlugins={[remarkGfm]}
                            components={{
                                code({node, inline, className, children, ...props}) {
                                    const match = /language-(\w+)/.exec(className || '')
                                    return !inline && match ? (
                                    <div className="relative">
                                        <pre className="p-4 bg-secondary rounded-md overflow-x-auto"><code className={className} {...props}>{children}</code></pre>
                                    </div>
                                    ) : (
                                    <code className="bg-muted px-1 rounded-sm" {...props}>{children}</code>
                                    )
                                }
                            }}
                        >
                            {response}
                        </ReactMarkdown>
                    )}
                </CardContent>
            </Card>
        )}
    </div>
  );
}
