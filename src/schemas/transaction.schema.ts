import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.number().positive("O valor deve ser maior que zero"),
  description: z.string().min(1, "A descrição é obrigatória"),
  category: z.string().optional(), // Categoria não obrigatória
  date: z.string().optional(), // Data não obrigatória (usará data atual)
  notes: z.string().optional(),
  paymentMethod: z.enum(["pix", "card"]).optional(),
  installments: z.number().int().positive().optional(),
  receivedStatus: z.enum(["received", "scheduled"]).optional(),
  scheduledDate: z.string().optional(),
  cardId: z.string().optional(),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;