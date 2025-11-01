
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BrainCircuit, Loader2, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { chatWithAI } from '@/lib/actions';
import type { Message } from '@/ai/flows/chat-flow';

export default function AiDiscussionPage() {
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Hello! How can I help you with your hackathon project today?', isUser: false },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (input.trim()) {
      const newMessages: Message[] = [...messages, { text: input, isUser: true }];
      setMessages(newMessages);
      setInput('');
      setIsLoading(true);

      try {
        const result = await chatWithAI(newMessages);
        if (result.response) {
            setMessages(prev => [...prev, { text: result.response, isUser: false }]);
        } else {
            // Handle error case, maybe show a toast
            setMessages(prev => [...prev, { text: "Sorry, I couldn't get a response. Please try again.", isUser: false }]);
        }
      } catch (error) {
        setMessages(prev => [...prev, { text: "An error occurred. Please try again later.", isUser: false }]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-2xl">
        <Card className="h-[70vh] flex flex-col">
          <CardHeader className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
              <BrainCircuit className="h-10 w-10 text-primary" />
            </div>
            <CardTitle className="font-headline text-3xl">
              AI Project Discussion
            </CardTitle>
            <CardDescription className="text-lg">
              Brainstorm and refine your hackathon ideas with an AI partner.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-start gap-3',
                  message.isUser ? 'justify-end' : 'justify-start'
                )}
              >
                {!message.isUser && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-xs rounded-lg p-3 text-sm',
                    message.isUser
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  {message.text}
                </div>
                 {message.isUser && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {isLoading && (
              <div className="flex items-start gap-3 justify-start">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className="bg-muted rounded-lg p-3 text-sm flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="p-4 border-t">
            <div className="flex w-full items-center space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !isLoading && handleSend()}
                placeholder="Ask a question about your project..."
                disabled={isLoading}
              />
              <Button onClick={handleSend} disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
