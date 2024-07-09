import {z} from 'zod'

export const acceptingMessageSchema = z.object({
    acceptMessages: z.boolean()
})