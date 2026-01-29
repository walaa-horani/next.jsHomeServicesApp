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
            <DialogTrigger asChild>
                <Button className="w-full bg-gradient-to-r from-primary to-pink-600 hover:from-primary/90 hover:to-pink-600/90 text-white text-lg py-8 shadow-xl shadow-primary/20 rounded-2xl transition-all duration-300 hover:scale-[1.02] border border-white/10 group">
                    <CalendarDays className="mr-3 h-6 w-6 group-hover:animate-pulse" />
                    <span className="font-bold tracking-wide">Book Appointment</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl w-[95vw] h-auto max-h-[90vh] overflow-y-auto rounded-[2.5rem] p-0 gap-0 border-white/20 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl shadow-2xl">
                <div className="p-8 pb-0">
                    <DialogHeader className="mb-6 space-y-3">
                        <DialogTitle className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500 pb-2">
                            Book a Service
                        </DialogTitle>
                        <DialogDescription className="text-base font-medium text-muted-foreground/80">
                            Select a Date and Time to schedule your premium service experience.
                        </DialogDescription>
                    </DialogHeader>

                    <div className='flex flex-col gap-8 lg:gap-10 py-4'>
                        {/* Calendar Column */}
                        <div className='flex flex-col gap-5'>
                            <h3 className="font-bold text-xl flex items-center gap-3 text-foreground/90">
                                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                                    <CalendarDays className="h-5 w-5" />
                                </div>
                                Select Date
                            </h3>
                            <div className="rounded-3xl border border-white/20 bg-white/50 dark:bg-white/5 shadow-inner p-4 hover:shadow-lg transition-shadow duration-300 w-full flex justify-center">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    disabled={(date) => date < new Date()}
                                    className="p-0"
                                    classNames={{
                                        head_cell: "text-muted-foreground font-semibold w-10",
                                        cell: "text-center text-sm p-0 sm:p-1 relative [&:has([aria-selected])]:bg-primary/10 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                        day: "h-10 w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-primary/10 rounded-full transition-all",
                                        day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground shadow-md shadow-primary/30",
                                        day_today: "bg-accent text-accent-foreground font-bold",
                                    }}
                                />
                            </div>
                        </div>

                        {/* Time Column */}
                        <div className='flex flex-col gap-5'>
                            <h3 className="font-bold text-xl flex items-center gap-3 text-foreground/90">
                                <div className="p-2 rounded-lg bg-pink-500/10 text-pink-500">
                                    <Clock className="h-5 w-5" />
                                </div>
                                Select Time Slot
                            </h3>

                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4 content-start">
                                {timeSlots.map((slot, index) => (
                                    <Button
                                        key={index}
                                        variant="outline"
                                        disabled={isSlotBooked(slot.time)}
                                        onClick={() => setSelectedTime(slot.time)}
                                        className={cn(
                                            "relative h-12 rounded-xl border-2 transition-all duration-300 overflow-hidden group",
                                            selectedTime === slot.time
                                                ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/25 scale-105"
                                                : "border-transparent bg-secondary/50 hover:bg-background hover:border-primary/30 hover:shadow-md",
                                            isSlotBooked(slot.time) && "opacity-40 cursor-not-allowed bg-muted hover:bg-muted hover:border-transparent grayscale"
                                        )}
                                    >
                                        <span className={cn(
                                            "relative z-10 font-semibold text-sm",
                                            selectedTime === slot.time ? "text-white" : "text-foreground group-hover:text-primary"
                                        )}>
                                            {slot.time}
                                        </span>
                                        {selectedTime === slot.time && (
                                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-shimmer" />
                                        )}
                                    </Button>
                                ))}
                            </div>

                            {date && selectedTime && (
                                <div className="mt-auto pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-between">
                                        <span className="text-sm font-medium text-muted-foreground">Selected:</span>
                                        <span className="font-bold text-primary">
                                            {format(date, 'MMM do')} at {selectedTime}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-secondary/30 backdrop-blur-sm border-t border-white/10 flex sm:justify-end gap-3 rounded-b-[2.5rem]">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => {/* Dialog close handled by trigger usually, but if needed we can add a close handler prop or use DialogClose */ }}
                        className="rounded-xl px-6 hover:bg-destructive/10 hover:text-destructive transition-colors"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleBook}
                        disabled={!date || !selectedTime || isBooking}
                        className={cn(
                            "rounded-xl px-8 bg-gradient-to-r from-primary to-pink-600 text-white font-bold shadow-lg shadow-primary/25 transition-all duration-300",
                            (!date || !selectedTime || isBooking) ? "opacity-50 cursor-not-allowed" : "hover:shadow-primary/40 hover:scale-105 hover:-translate-y-0.5"
                        )}
                    >
                        {isBooking ? (
                            <span className="flex items-center gap-2">
                                <span className="h-4 w-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                                Booking...
                            </span>
                        ) : (
                            "Confirm Booking"
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default BookingModal