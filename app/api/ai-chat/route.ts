import { NextResponse } from "next/server";
import { hygraphClient, GET_BUSINESSES, GET_CATEGORIES } from "@/lib/hygraph";

export async function POST(req: Request) {
    try {
        const { prompt } = await req.json();

        // 1. Fetch Data from Hygraph (Context for the AI)
        // In a real app, we would use vector search or pass this to an LLM context
        let businesses: any = { businesses: [] };
        let categories: any = { categories: [] };

        try {
            businesses = await hygraphClient.request(GET_BUSINESSES);
            categories = await hygraphClient.request(GET_CATEGORIES);
        } catch (error) {
            console.error("Hygraph fetch error (likely generic/auth):", error);
            // Fallback or ignore if keys aren't set
        }

        // 2. Simple Keyword Matching Logic (Mock AI)
        const lowerPrompt = prompt.toLowerCase();
        let responseText = "I can help you find a service. Try asking for 'cleaning', 'plumbing', or 'repair'.";
        let matchedServices = [];

        if (lowerPrompt.includes("clean")) {
            responseText = "Here are some top-rated cleaning services available for you:";
            console.log("Businesses fetched:", JSON.stringify(businesses.bussinesses, null, 2));
            matchedServices = businesses?.bussinesses?.filter((b: any) =>
                b.category?.name?.toLowerCase().includes("clean")
            ) || [];
        } else if (lowerPrompt.includes("repair") || lowerPrompt.includes("fix")) {
            responseText = "I found these repair specialists nearby:";
            matchedServices = businesses?.bussinesses?.filter((b: any) =>
                b.category?.name?.toLowerCase().includes("repair") ||
                b.name.toLowerCase().includes("repair")
            ) || [];
        } else if (lowerPrompt.includes("paint")) {
            responseText = "Looking to add some color? Check out these painters:";
            matchedServices = businesses?.bussinesses?.filter((b: any) =>
                b.category?.name?.toLowerCase().includes("paint")
            ) || [];
        }

        // 3. Construct Response
        return NextResponse.json({
            role: "ai",
            content: responseText,
            recommendations: matchedServices.slice(0, 3) // Limit to 3
        });

    } catch (error) {
        console.error("AI API Error:", error);
        return NextResponse.json({ role: "ai", content: "Sorry, I'm having trouble connecting to the server right now." }, { status: 500 });
    }
}
