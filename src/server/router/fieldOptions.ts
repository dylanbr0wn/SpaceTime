import { createRouter } from "./context";
import { z } from "zod";
import { zFieldOption } from "../../utils/types/zod";

export const fieldOptionRouter = createRouter()
    .query("readAll", {
        input: z
            .object({
                rowFieldId: z.string(),
            }),
        output: z.array(zFieldOption),
        async resolve({ ctx, input }) {
            return await ctx.prisma.fieldOption.findMany({
                where: {

                    rowFieldId: input.rowFieldId,

                },
            });
        },
    });
