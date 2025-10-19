'use client';

import { CareerAdvisor } from "@/components/career-advisor";
import { useUser, useFirestore, useCollection } from "@/firebase";
import { collection, query, where } from "firebase/firestore";
import { useMemo } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function CareerGuidancePage() {
    const { user } = useUser();
    const firestore = useFirestore();

    const certificatesQuery = useMemo(() => {
        if (!user || !firestore) return null;
        return query(collection(firestore, 'certificates'), where('studentId', '==', user.uid));
    }, [user, firestore]);

    const { data: certificates, isLoading } = useCollection<any>(certificatesQuery);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold font-headline">Career Guidance</h1>
                <p className="text-muted-foreground">Get AI-powered career advice based on your achievements.</p>
            </div>

            {isLoading && (
                <Card>
                    <CardHeader>
                        <CardTitle>Loading Your Certificates...</CardTitle>
                        <CardDescription>The career advisor is waiting for your certificate data.</CardDescription>
                    </CardHeader>
                </Card>
            )}

            {!isLoading && certificates && certificates.length === 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>No Certificates Found</CardTitle>
                        <CardDescription>You need at least one certificate to use the AI Career Advisor.</CardDescription>
                    </CardHeader>
                </Card>
            )}

            {certificates && certificates.length > 0 && <CareerAdvisor certificates={certificates.map(c => c.title)} />}
        </div>
    );
}
