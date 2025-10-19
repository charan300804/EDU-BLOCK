// @ts-nocheck
'use server'

import { getCareerSuggestions } from "@/ai/flows/ai-career-guidance";
import { z } from "zod";

const careerAdviceSchema = z.object({
    certificateTitle: z.string().min(1, { message: "Certificate title is required." }),
});

export async function getCareerAdvice(prevState: any, formData: FormData) {
    const validatedFields = careerAdviceSchema.safeParse({
        certificateTitle: formData.get('certificateTitle'),
    });

    if (!validatedFields.success) {
        return {
            error: validatedFields.error.flatten().fieldErrors,
        };
    }

    try {
        const result = await getCareerSuggestions({ certificateTitle: validatedFields.data.certificateTitle });
        return { data: result };
    } catch (error) {
        console.error(error);
        return { error: "An unexpected error occurred. Please try again." };
    }
}
