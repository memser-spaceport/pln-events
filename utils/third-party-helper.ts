import { z } from "zod";
import { ERROR_MESSAGES } from "./constants";

export function checkIsValidEmail(email: string): boolean {
    const emailSchema = z.string().email({ message: ERROR_MESSAGES.InvalidEmail });
    const validationResponse = emailSchema.safeParse(email);
    if (!validationResponse.success) {
        return false;
    }
    return true;
}