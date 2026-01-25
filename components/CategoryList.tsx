import { GET_CATEGORIES, hygraphClient } from '@/lib/hygraph';
import React from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Card, CardContent } from "@/components/ui/card"
import Image from 'next/image';
import Link from 'next/link';
import { Bot } from 'lucide-react';

export default async function CategoryList() {
    let categories: any[] = [];


    try {
        const data: any = await hygraphClient.request(GET_CATEGORIES);
        categories = data.categories;
        console.log("Categories fetched:", categories);
    } catch (error) {
        console.error("Failed to fetch categories:", error);
    }

    if (!categories || categories.length === 0) {
        return <div className="p-4 text-center">No categories found.</div>;
    }

    return (
        <section className='py-10 px-4 md:px-10 lg:px-20'>

            <h2 className='text-3xl font-bold mb-6 text-center text-primary'>Explore Categories</h2>
            <div className='flex items-center justify-center'>
                <Carousel
                    opts={{
                        align: "start",
                        loop: true,
                    }}
                    className="w-full max-w-sm md:max-w-2xl lg:max-w-5xl"
                >
                    <CarouselContent className="-ml-1">
                        {categories.map((category, index) => (


                            <CarouselItem key={category.id} className="pl-1 md:basis-1/2 lg:basis-1/4">
                                <Link href={`/?category=${category.slug}`} key={index} scroll={false}>
                                    <div className="p-1">
                                        <div
                                            className="rounded-2xl shadow-lg hover:scale-105 transition-transform duration-300 cursor-pointer overflow-hidden group"
                                            style={{ backgroundColor: category.bgcolor?.hex || '#ffffff' }}
                                        >
                                            <Card className="bg-transparent border-none shadow-none">
                                                <CardContent className="flex flex-col items-center justify-center p-6 aspect-square">
                                                    <div className="relative w-24 h-24 mb-4">
                                                        {category.image && (
                                                            <Image
                                                                src={category.image.url}
                                                                alt={category.name}
                                                                fill
                                                                className="object-contain"
                                                            />
                                                        )}
                                                    </div>
                                                    <span className="text-lg font-semibold text-center text-foreground group-hover:text-primary transition-colors">
                                                        {category.name}
                                                    </span>
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </div>
                                </Link>
                            </CarouselItem>

                        ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </div>
        </section>
    )
}
