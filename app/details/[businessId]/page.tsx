import { GET_BUSINESS_BY_ID, GET_BUSINESSES_BY_CATEGORY, GET_CATEGORIES, hygraphClient } from '@/lib/hygraph';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, Mail, MapPin, Share2, Star, User } from 'lucide-react';
import React from 'react'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Link from 'next/link';
import Image from 'next/image';
import BookingModal from '@/components/BookingModal';
import OfferModal from '@/components/OfferModal';

async function page({ params }: { params: Promise<{ businessId: string }> }) {
    const { businessId } = await params;

    let business: any = null;
    let categories: any[] = [];
    let relatedBusinesses: any[] = [];


    try {
        const data: any = await hygraphClient.request(GET_BUSINESS_BY_ID, { id: businessId });
        business = data.bussiness;

        // console.log("Fetching related for slug:", business?.category?.slug);
        if (business?.category?.slug) {
            const [catData, relData] = await Promise.all([
                hygraphClient.request(GET_CATEGORIES),
                hygraphClient.request(GET_BUSINESSES_BY_CATEGORY, { slug: business.category.slug })
            ]

            )

            categories = catData.categories;

            const rawBusinesses = relData.bussinesses || relData.bussiness || relData.businesses || [];


            relatedBusinesses = rawBusinesses.filter((b: any) => b.id !== businessId);

        } else {
            const catData: any = await hygraphClient.request(GET_CATEGORIES);
            categories = catData.categories;
        }

    } catch (error) {
        console.error("Error fetching business details:", error);
    }

    if (!business) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <div className="text-center text-muted-foreground">
                    <h2 className="text-2xl font-bold">Business not found</h2>
                    <p>The business you are looking for does not exist or has been removed.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950">
            <div className="container mx-auto px-4 py-8 lg:py-12 p-3">


                <div className="grid p-3 grid-cols-1 md:grid-cols-2 gap-8 items-center justify-between">


                    <div className="mt-5 p-3">



                        <div className="relative aspect-video   w-full rounded-[2.5rem] overflow-hidden shadow-xl ring-8 ring-white dark:ring-slate-900">
                            {business.image?.url ? (
                                <img
                                    src={business.image.url}
                                    alt={business.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-slate-200 flex items-center justify-center">No Image</div>
                            )}
                        </div>


                    </div>

                    {/* RIGHT COLUMN: Booking (4 Units on Large screens, No Border) */}
                    <div className="col-span-12 lg:col-span-4 ">
                        <div >
                            <Card className="border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden">
                                <CardContent className="p-8">

                                    {/* Expert Profile */}
                                    <div className="flex items-center p-4 gap-4 mb-10">
                                        <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-blue-600 p-0.5">
                                            <img
                                                src={`https://ui-avatars.com/api/?name=${business.contact}&background=random&color=fff`}
                                                alt={business.contact}
                                                className=" rounded-full ml-3 h-full w-full object-cover rounded-[calc(1rem-2px)]"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] uppercase font-black text-primary tracking-widest">Provider</p>
                                            <h3 className="font-bold text-lg leading-none">{business.contact}</h3>
                                        </div>
                                        <Button variant="secondary" size="icon" className="rounded-full h-10 w-10">
                                            <Share2 className="h-4 w-4" />
                                        </Button>
                                    </div>

                                    {/* Vertical Info List */}
                                    <div className="space-y-3 mb-8">
                                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-800/40">
                                            <Clock className="h-5 w-5 text-primary" />
                                            <div>
                                                <p className="text-[10px] uppercase font-bold text-slate-400">Availability</p>
                                                <p className="text-sm font-bold">8:00 AM - 10:00 PM</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-800/40">
                                            <Mail className="h-5 w-5 text-primary" />
                                            <div className="overflow-hidden">
                                                <p className="text-[10px] uppercase font-bold text-slate-400">Email</p>
                                                <p className="text-sm font-bold truncate">contact@service.com</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-800/40">
                                            <User className="h-5 w-5 text-primary" />
                                            <div className="overflow-hidden">
                                                <p className="text-[10px] uppercase font-bold text-slate-400">About</p>
                                                <p className="text-sm font-bold truncate">{business.about}</p>
                                            </div>
                                        </div>

                                    </div>





                                    {/* Primary CTA */}
                                    <div className="mt-6 flex flex-col gap-3">
                                        <BookingModal businessId={businessId} />

                                    </div>

                                    <div className="mt-5 flex flex-col gap-3">

                                        <OfferModal
                                            businessId={businessId}
                                            businessName={business.name}
                                            businessEmail={business.email}
                                        />

                                    </div>


                                </CardContent>
                            </Card>
                        </div>
                    </div>

                </div>



            </div>

            {/* Similiar Businesses Carousel */}
            {relatedBusinesses.length > 0 && (
                <div className='mb-12 mt-5'>

                    <Carousel className='w-full max-w-5xl mx-auto'>
                        <h2 className="text-3xl font-bold mb-6">Similar Businesses</h2>
                        <CarouselContent>
                            {relatedBusinesses.map((bus: any) => (

                                <CarouselItem key={bus.id} className="pl-4 md:basis-1/4 lg:basis-1/4">
                                    <Link href={`/details/${bus.id}`}>
                                        <div className="p-1">
                                            <Card className="hover:shadow-lg transition-shadow border-none overflow-hidden h-full">
                                                <div className="relative h-32 w-full mb-2">
                                                    <Image width={600} height={600} src={bus.image?.url} alt={bus.name} className="w-[250px] h-[250px] object-cover" />
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="font-bold text-lg truncate">{bus.name}</h3>
                                                    <p className="text-sm text-muted-foreground truncate">{bus.address}</p>
                                                    <Badge variant="outline" className="mt-2">{bus.category?.name}</Badge>
                                                </div>
                                            </Card>
                                        </div>
                                    </Link>
                                </CarouselItem>

                            ))}

                        </CarouselContent>


                    </Carousel>
                </div>
            )}
        </div>
    )
}

export default page