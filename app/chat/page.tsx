import React from 'react'
import { Sparkles, MessageSquare } from 'lucide-react'
import ChatInterface from '@/components/ChatInterface'

export default function ChatPage() {
    return (
        <div className="container mx-auto max-w-4xl py-6 h-[calc(100vh-64px)] flex flex-col">
            <div className="mb-6 flex items-center gap-3">
                <div className="p-5 bg-gradient-to-br from-primary to-purple-600 rounded-xl shadow-lg shadow-primary/20">
                    <MessageSquare className=" text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        AI Service Assistant
                        <Sparkles className="w-5 h-5 text-yellow-500 fill-yellow-500 animate-pulse" />
                    </h1>
                    <p className="text-muted-foreground">Ask me anything about our home services!</p>
                </div>
            </div>

            <div className="flex-1 border rounded-3xl  shadow-sm bg-background/50 backdrop-blur-sm p-4 relative isolate">
                <div className=" bg-gradient-to-b from-primary/5 to-transparent pointer-events-none -z-10" />
                <ChatInterface />
            </div>
        </div>
    )
}
