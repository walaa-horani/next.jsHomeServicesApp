"use client"

import React, { useEffect, useState } from 'react'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from './ui/button';
import { CalendarDays, Clock } from 'lucide-react';
import { Calendar } from './ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { createNewBooking, getBookings } from '@/app/actions/booking';
import { toast } from 'sonner';
interface BookingModalProps {
    businessId: string;
}
function BookingModal({ businessId }: BookingModalProps) {

    const [date, setDate] = React.useState<Date | undefined>(new Date())
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [isBooking, setIsBooking] = useState(false);

    const timeSlots = [
        { time: "10:00 AM" },
        { time: "10:30 AM" },
        { time: "11:00 AM" },
        { time: "11:30 AM" },
        { time: "12:00 PM" },
        { time: "02:00 PM" },
        { time: "02:30 PM" },
        { time: "03:00 PM" },
        { time: "03:30 PM" },
    ];

    const [bookedSlots, setBookedSlots] = useState<{ time: string }[]>([]);
    useEffect(() => {
        const fetchBookings = async () => {

            if (date && businessId) {
                const formattedDate = format(date, 'yyyy-MM-dd')
                const bookings = await getBookings(businessId, formattedDate);
                setBookedSlots(bookings);
            }

        }
        fetchBookings();
    }, [date, businessId])

    const isSlotBooked = (time: string) => {
        return bookedSlots.some(booking => booking.time === time);
    };


    const handleBook = async () => {
        if (!date || !selectedTime) return;

        setIsBooking(true);
        try {
            const formattedDate = date.toISOString();
            const result = await createNewBooking({
                businessId,
                date: formattedDate, // This will now be "2026-01-26T00:00:00.000Z"
                time: selectedTime,
            });
            if (result.success) {
                toast.success("Booking created successfully");
                setBookedSlots(prev => [...prev, { time: selectedTime }]);
                setSelectedTime(null);
            } else {
                toast.error("Failed to create booking");
            }
        } catch (error) {
            toast.error("Failed to create booking" + error);
        } finally {
            setIsBooking(false);
        }


    }




    return (
        <Dialog>
            <DialogTrigger>
                <Button className="w-full bg-primary hover:bg-primary/90 text-lg py-6 shadow-lg shadow-primary/20">
                    <CalendarDays className="mr-2 h-5 w-5" /> Book Appointment
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-[90vw] h-[85vh] md:h-auto overflow-y-auto rounded-[2rem]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        Book a Service
                    </DialogTitle>
                    <DialogDescription>
                        Select a Date and Time to schedule your service.
                    </DialogDescription>
                </DialogHeader>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6 py-4'>
                    {/* Calendar Column */}
                    <div className='flex flex-col gap-4'>
                        <h3 className="font-semibold flex items-center gap-2">
                            <CalendarDays className="h-5 w-5 text-primary" /> Select Date
                        </h3>
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            disabled={(date) => date < new Date()}
                            className="rounded-2xl border shadow-sm bg-card p-4"
                        />
                    </div>

                    {/* Time Column */}
                    <div className='flex flex-col gap-4'>
                        <h3 className="font-semibold flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary" /> Select Time Slot
                        </h3>

                        <div className="grid grid-cols-3 gap-3">
                            {timeSlots.map((slot, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    disabled={isSlotBooked(slot.time)}
                                    onClick={() => setSelectedTime(slot.time)}
                                    className={cn(
                                        "border-primary/20 hover:bg-primary/10 hover:text-primary transition-all",
                                        selectedTime === slot.time && "bg-primary text-white hover:bg-primary hover:text-white ring-2 ring-offset-2 ring-primary",
                                        isSlotBooked(slot.time) && "opacity-50 cursor-not-allowed bg-muted text-muted-foreground"
                                    )}
                                >
                                    {slot.time}
                                </Button>
                            ))}
                        </div>
                    </div>
                </div>
                <DialogFooter className="sm:justify-end gap-2">
                    <Button type="button" variant="secondary">
                        Close
                    </Button>
                    <Button type="button" onClick={handleBook} disabled={!date || !selectedTime}>
                        Confirm Booking
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default BookingModal