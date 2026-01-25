"use server"
import { CREATE_BOOKING, GET_BOOKINGS_BY_BUSINESS, PUBLISH_BOOKING, hygraphClient } from "@/lib/hygraph";
import { currentUser } from "@clerk/nextjs/server";



export async function getBookings(businessId: string, date: string) {

    try {

        const { bookingses } = await hygraphClient.request<{ bookingses: { time: string; date: string }[] }>(
            GET_BOOKINGS_BY_BUSINESS,
            {
                businessId,
            }
        );


        // Filter valid bookings for the specific date
        const filteredBookings = bookingses.filter(booking =>
            booking.date.startsWith(date)
        );


        return filteredBookings;
    } catch (error) {
        console.error("Error fetching bookings:", error);
        return [];
    }

}

export async function createNewBooking({ businessId, date, time }: { businessId: string, date: string, time: string }) {
    const user = await currentUser();

    if (!user) {
        return { success: false, error: "Unauthorized" };
    }

    const email = user.emailAddresses[0]?.emailAddress;
    const userName = user.fullName || user.firstName || "Guest";

    if (!email) {
        return { success: false, error: "No email found for user" };
    }

    try {

        const result = await hygraphClient.request<{ createBookings: { id: string } }>(CREATE_BOOKING, {
            date,
            time,
            userEmail: email,
            userName,
            businessId,
        });

        const bookingId = result.createBookings.id;

        await hygraphClient.request(PUBLISH_BOOKING, {
            id: bookingId,
        });



        return { success: true };



    } catch (error) {

        console.error("Error creating booking:", error);
        return { success: false, error: "Failed to create booking" };

    }





}