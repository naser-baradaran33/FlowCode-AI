"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function DemoPage() {

    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);

    const handleBlocking = async () => {
        setLoading(true);
        await fetch('/api/demo/blocking', {
            method: 'POST',
        });
         setLoading(false);
    };

    const handleBackground = async () => {
        setLoading2(true);
        await fetch('/api/demo/background', {
            method: 'POST',
        });
         setLoading2(false);
    };
    
    // Client error-throw in the browser 
    const handleClientError = () => {
        throw new Error("Client error: Something went wrong in the browser!");
    };

    // API error - triggers server -side error 
    const handleAPIError = async () => {
        await fetch('/api/demo/api-error', {
            method: 'POST',
        });
    };

    // Inngest error - triggers error in background 
    const handleInngestError = async () => {
        await fetch('/api/demo/inngest-error', {
            method: 'POST',
        });
    };


    return (
        <div className="p-8 space-x-4">
            <Button disabled={loading} onClick={handleBlocking}>
                {loading ? 'Loading...' : 'Blocking'}
            </Button>
            <Button disabled={loading2} onClick={handleBackground}>
                {loading2 ? 'Loading...' : 'Background'}
            </Button>
            <Button variant="destructive" onClick={handleAPIError}>
                API Error
            </Button>
            <Button variant="destructive" onClick={handleClientError}>
                Client Error
            </Button>
            <Button variant="destructive" onClick={handleInngestError}>
                Inngest Error
            </Button>
        </div>
    );
}