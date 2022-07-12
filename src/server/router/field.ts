import { createRouter } from "./context";
import { z } from "zod";
import { zEntryComment, zField } from "../../utils/types/zod";

export const fieldRouter = createRouter()
    .query("read", {
        input: z
            .object({
                id: z.string(),
            }),
        async resolve({ input, ctx }) {
            return await ctx.prisma.field.findUniqueOrThrow({
                where: {
                    id: input.id,
                },
                include: {
                    fieldOptions: true
                }
            });
        },
    })
    .query("readAll", {
        input: z
            .object({
                tenantId: z.string(),
            }),
        async resolve({ ctx, input }) {
            return await ctx.prisma.field.findMany({
                where: {
                    tenant: {
                        id: input.tenantId,
                    }
                },
            });
        },
    });
