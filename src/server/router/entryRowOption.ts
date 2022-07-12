import { createRouter } from "./context";
import { z } from "zod";
import { zEntryRowOption } from "../../utils/types/zod";

export const entryRowOptionRouter = createRouter()
    .query("read", {
        input: z
            .object({
                rowId: z.string(),
                fieldId: z.string(),
            })
            .required(),
        async resolve({ input, ctx }) {
            return await ctx.prisma.entryRowOption.findUniqueOrThrow({
                where: {
                    fieldId_timeEntryRowId: {
                        timeEntryRowId: input.rowId,
                        fieldId: input.fieldId,
                    },
                },
                include: {
                    fieldOption: true
                }
            });
        },
    })
    .mutation("update", {
        input: z
            .object({
                rowId: z.string(),
                fieldId: z.string(),
                fieldOptionId: z.string(),
            }),
        async resolve({ input, ctx }) {
            return await ctx.prisma.entryRowOption.upsert({
                where: {
                    fieldId_timeEntryRowId: {
                        timeEntryRowId: input.rowId,
                        fieldId: input.fieldId,
                    },
                },
                update: {
                    fieldOptionId: input.fieldOptionId,
                },
                create: {
                    timeEntryRowId: input.rowId,
                    fieldId: input.fieldId,
                    fieldOptionId: input.fieldOptionId,
                },
                include: {
                    fieldOption: true
                }
            });
        },
    });
