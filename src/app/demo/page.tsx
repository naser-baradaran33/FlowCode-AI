"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function DemoPage() {

    const [loading, setLoading] = useState(false);
    const [loading2, setLoading2] = useState(false);

    const handleButtonClick = async () => {
        setLoading(true);
        await fetch('/api/demo/blocking', {
            method: 'POST',
        });
         setLoading(false);
    };

    const handleBackground = async () => {
        setLoading(true);
        await fetch('/api/demo/background', {
            method: 'POST',
        });
         setLoading(false);
    };
    return (
        <div className="p-8 space-x-4">
            <Button disabled={loading} onClick={handleButtonClick}>
                {loading ? 'Loading...' : 'Blocking'}
            </Button>
            <Button disabled={loading2} onClick={handleBackground}>
                {loading ? 'Loading...' : 'Background'}
            </Button>

        </div>
    );
}