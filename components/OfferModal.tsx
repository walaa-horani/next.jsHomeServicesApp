"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DollarSign, Send, Gift } from "lucide-react";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { sendOffer } from "@/app/actions/send-offer";

interface OfferModalProps {
    businessId: string;
    businessName: string;
    businessEmail: string;
}

export default function OfferModal({ businessId, businessName, businessEmail }: OfferModalProps) {
    const { user } = useUser();
    const [price, setPrice] = useState("");
    const [note, setNote] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const handleSendOffer = async () => {
        if (!user) {
            alert("You must be logged in to send an offer.");
            return;
        }
        if (!price || isNaN(Number(price))) {
            alert("Please enter a valid price.");
            return;
        }

        setIsLoading(true);

        try {
            const result = await sendOffer({
                businessId,
                businessName,
                businessEmail,
                offeredPrice: parseFloat(price),
                userEmail: user.primaryEmailAddress?.emailAddress || "unknown@example.com",
                userName: user.fullName || "Anonymous User",
                note
            });

            if (result.success) {
                alert("Offer sent successfully! The owner will receive an email.");
                setIsOpen(false);
                setPrice("");
                setNote("");
            } else {
                alert(`Failed to send offer: ${result.error}`);
            }
        } catch (error) {
            console.error("Offer error:", error);
            alert("An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger >
                <Button variant="secondary" className="w-full bg-secondary/10 hover:bg-secondary/20 text-secondary-foreground border-secondary/50 border">
                    <Gift className="mr-2 h-4 w-4" /> Send Your Offer
                </Button>
            </DialogTrigger>
            <DialogContent className="w-[350px]">
                <div className="px-6 pt-6 pb-2">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl">
                            <div className="p-2 rounded-full bg-primary/10">
                                <Gift className="h-5 w-5 text-primary" />
                            </div>
                            Make an Offer
                        </DialogTitle>
                        <DialogDescription className="text-base pt-1">
                            Propose your price to <span className="font-semibold text-foreground">{businessName}</span>.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <div className="px-6 py-2 space-y-5">
                    <div className="space-y-4">
                        <Label htmlFor="price" className="text-sm font-semibold">
                            Your Price
                        </Label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                            <Input
                                id="price"
                                type="number"
                                placeholder="0.00"
                                className="pl-10 h-11 text-lg font-medium bg-muted/30 border-muted-foreground/20 focus-visible:ring-primary/20"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-4 mt-5">
                        <Label htmlFor="note" className="text-sm font-semibold">
                            Note (Optional)
                        </Label>
                        <Textarea
                            id="note"
                            placeholder="I need this done by tomorrow..."
                            className="resize-none min-h-[100px] bg-muted/30 border-muted-foreground/20 focus-visible:ring-primary/20"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>
                </div>

                <DialogFooter className="px-6 py-4 bg-muted/20 flex flex-col sm:flex-row gap-3">
                    <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="h-11 rounded-xl">
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSendOffer}
                        disabled={isLoading || !price}
                        className="text-primary-foreground hover:bg-primary/90 flex-1"
                    >
                        {isLoading ? "Sending Offer..." : "Send Offer"} <Send className="ml-2 h-4 w-4" />
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
