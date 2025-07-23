import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.number().positive("O valor deve ser maior que zero"),
  description: z.string().min(1, "A descrição é obrigatória"),
  category: z.string().min(1, "A categoria é obrigatória"),
  date: z.string().min(1, "A data é obrigatória"),
  notes: z.string().optional(),
  paymentMethod: z.enum(["pix", "card"]).optional(),
  installments: z.number().int().positive().optional(),
  receivedStatus: z.enum(["received", "scheduled"]).optional(),
  scheduledDate: z.string().optional(),
  cardId: z.string().optional(),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;