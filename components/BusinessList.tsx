import { GET_BUSINESSES, hygraphClient } from '@/lib/hygraph';
import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import Link from 'next/link';
import { Button } from './ui/button';

async function BusinessList({ category }: { category?: string }) {

    let businesses: any[] = [];

    try {
        const data: any = await hygraphClient.request(GET_BUSINESSES);
        businesses = data.bussinesses || [];
    } catch (error) {
        console.error("Failed to fetch businesses:", error);
    }

    const filteredBusinesses = category && category !== 'all'
        ? businesses.filter((business: any) => business.category?.slug === category)
        : businesses;

    return (
        <div className='py-12 container mx-auto px-4'>

            <h2 className="text-3xl font-bold mb-8">Our Business</h2>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>

                {filteredBusinesses.length > 0 ? (
                    filteredBusinesses.map((business, index) => (
                        <Link href={`/details/${business.id}`} key={index} scroll={false}>
                            <Card key={index} className="overflow-hidden border-none shadow-md hover:shadow-xl transition-shadow dark:bg-card/50 backdrop-blur-sm group">
                                <div className="relative h-48 w-full overflow-hidden">
                                    {business.image?.url ? (
                                        <img
                                            src={business.image.url}
                                            alt={business.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">No Image</div>
                                    )}
                                    <Badge className="absolute top-2 left-2 bg-primary/80 backdrop-blur-sm">{business.category?.name}</Badge>
                                </div>
                                <CardHeader className="p-4 pb-2">
                                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded w-fit mb-2">{business.category?.name}</span>
                                    <CardTitle className="text-lg">{business.name}</CardTitle>
                                    <p className="text-sm text-primary font-medium">{business.contact}</p>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    <p className="text-sm text-muted-foreground truncate">{business.address}</p>
                                </CardContent>
                                <CardFooter className="p-4 pt-0">
                                    <Link href={`/details/${business.id}`} className="w-full">
                                        <Button className="w-full bg-primary hover:bg-primary/90">Book Now</Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        </Link>
                    ))
                ) : (
                    <div className="col-span-4 text-center text-muted-foreground">
                        No businesses found.
                    </div>
                )}

            </div>
        </div>
    )
}

export default BusinessList