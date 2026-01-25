"use client"
import { SignInButton, UserButton, useUser } from '@clerk/nextjs';
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button';
import { Sparkles } from 'lucide-react';

function Navbar() {

    const { user } = useUser();
    return (
        <header className=' w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60'>

            <div className='container mx-auto flex h-16 items-center px-4 justify-between'>
                <Link href="/" className="mt-5">
                    <Image className='w-20 h-20' src="/logo.png" alt="logo" width={130} height={130} />
                </Link>

                <nav className="hidden md:flex gap-6 items-center font-medium">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <Link href="/services" className="hover:text-primary transition-colors">Services</Link>
                    <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
                </nav>

                <div className='flex items-center gap-4'>
                    <Link href="/chat">
                        <Button

                            size="sm"
                        >
                            <Sparkles className="w-4 h-4 text-yellow-200 fill-yellow-200" />
                            <span className="font-semibold hidden sm:inline">AI Assistant</span>
                        </Button>
                    </Link>
                    {user ? (
                        <UserButton />
                    ) : (
                        <SignInButton mode="modal">
                            <Button variant="outline" className="hover:bg-primary hover:text-white dark:hover:text-white">Login / Sign Up</Button>
                        </SignInButton>
                    )}
                </div>


            </div>

        </header>
    )
}

export default Navbar