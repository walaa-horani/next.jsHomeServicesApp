"use client"

import { Bot, Send, User } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import { Input } from './ui/input';
import { Button } from './ui/button';
import Link from 'next/link';




interface Service {
    id: string;
    name: string;
    description?: string;
    image: { url: string };
    category: { name: string };
    contactPerson?: string;
    address?: string;
}


interface Message {
    role: 'user' | 'ai';
    content: string;
    recommendations?: Service[];
}

function ChatInterface() {

    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'ai',
            content: 'Hello! I can help you find the best home services. Try asking for "cleaning", "plumbing", or "repair".'
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const scrollRef = useRef<HTMLDivElement>(null);


    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);


    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/ai-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: userMessage.content }),
            });

            if (!response.ok) throw new Error('Failed to fetch response');

            const data = await response.json();

            // The API returns { role: "ai", content: string, recommendations: [] }
            const aiMessage: Message = {
                role: 'ai', // or data.role
                content: data.content,
                recommendations: data.recommendations
            };

            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I'm having trouble connecting right now." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSend();
    }


    return (
        <div className="flex flex-col h-full relative">
            <div className="flex-1 overflow-y-auto p-6 pr-4 custom-scrollbar" style={{ maxHeight: 'calc(100vh - 140px)' }}> {/* Adjust height accounting for header/footer */}
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex items-center gap-4  mb-8 w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'ai' && (
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20 shadow-sm">
                                <Bot className="w-6 h-6 text-primary" />
                            </div>
                        )}
                        {msg.role === 'user' && (
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 text-primary-foreground shadow-md">
                                <User className="w-6 h-6" />
                            </div>
                        )}

                        <div className={`max-w-[80%] rounded-3xl px-6 py-4 text-base shadow-sm ${msg.role === 'user'
                            ? 'bg-primary text-primary-foreground rounded-bl-xs'
                            : 'bg-card dark:bg-muted/50 text-card-foreground border rounded-bl-xs'
                            }`}>
                            <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>

                            {/* Recommendations Grid */}
                            {msg.recommendations && msg.recommendations.length > 0 && (
                                <div className="mt-5 grid gap-4">
                                    {msg.recommendations.map((service, i) => (
                                        <Link href={`/details/${service.id}`} key={i || service.id} className="block">
                                            <div className="bg-background/50 border rounded-xl p-3 shadow-sm hover:shadow-md transition-all cursor-pointer flex gap-4 items-center">
                                                {service.image?.url &&
                                                    <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden border">
                                                        <Image
                                                            src={service.image.url}
                                                            alt={service.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                }
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-base truncate">{service.name}</h4>
                                                    <span className="inline-block px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mt-1.5">
                                                        {service.category?.name}
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>


                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-4 justify-start items-center mb-8">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                            <Bot className="w-6 h-6 text-primary" />
                        </div>
                        <div className="bg-muted px-6 py-4 rounded-3xl rounded-bl-xs flex items-center shadow-sm border">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce"></span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={scrollRef} />
            </div>

            <div className=" w-full p-3">
                <div className="flex w-full items-center justify-between gap-3">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        className="pr-12 py-6 rounded-full bg-muted/50 border-muted-foreground/20 focus-visible:ring-primary/20"
                    />
                    <Button
                        size="icon"
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className=" h-9 w-9 rounded-full shrink-0 shadow-sm"
                    >
                        <Send className="w-4 h-4" />
                        <span className="sr-only">Send</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ChatInterface