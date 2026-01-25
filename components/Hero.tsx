import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function Hero() {
    return (
        <div className="relative flex items-center justify-center min-h-[600px] w-full overflow-hidden bg-background">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/30 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/30 rounded-full blur-[120px] animate-pulse delay-1000" />
            </div>

            <div className="relative z-10 container mx-auto px-4 text-center">
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
                    Find Your <span className="text-primary">Perfect</span> <br />
                    <span className="text-secondary">Home Service</span>
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                    From cleaning to repairs, book trusted professionals instantly with our AI-powered marketplace.
                </p>

                <div className="glass p-2 rounded-full max-w-xl mx-auto flex items-center gap-2 shadow-xl neon-glow">
                    <Input
                        type="text"
                        placeholder="Search for 'Kitchen Cleaning'..."
                        className="border-0 bg-transparent focus-visible:ring-0 text-lg py-6"
                    />
                    <Button size="icon" className="rounded-full bg-primary hover:bg-primary/90 h-12 w-12 shrink-0">
                        <Search className="h-6 w-6 text-white" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
