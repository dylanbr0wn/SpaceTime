import { createRouter } from "./context";
import { z } from "zod";
import { zEntryComment, zTenant } from "../../utils/types/zod";

export const tenantRouter = createRouter()
    .query("read", {
        input: z
            .object({
                id: z.string(),
            }),
        async resolve({ input, ctx }) {
            return await ctx.prisma.tenant.findUniqueOrThrow({
                where: {
                    id: input.id,
                },
                include: {
                    tenantActivefields: {
                        include: {
                            field: true
                        }
                    }
                }
            });
        },
    })
    .mutation("create", {
        input: z.object({
            name: z.string(),
            description: z.string().optional(),
            isActive: z.boolean(),
            startDate: z.date(),
            periodLength: z.number(),
            logo: z.string().optional(),
        }),
        async resolve({ input, ctx }) {
            return await ctx.prisma.tenant.create({
                data: {
                    ...input,
                },

            });
        },
    }).mutation("update", {
        input: z.object({
            id: z.string(),
            name: z.string(),
            description: z.string().optional(),
            isActive: z.boolean().optional(),
            startDate: z.date(),
            periodLength: z.number(),
            logo: z.string().optional(),
            tenantActiveFields: z.array(z.string()).optional(),
        }),
        async resolve({ input, ctx }) {
            await ctx.prisma.tenantActiveField.deleteMany({
                where: {
                    tenantId: input.id,
                }
            })
            const [tenant] = await Promise.all([
                ctx.prisma.tenant.update({
                    where: {
                        id: input.id,
                    },
                    data: {
                        name: input.name ?? undefined,
                        description: input.description,
                        isActive:
                            input.isActive === null ? undefined : input.isActive,
                        periodLength: input.periodLength ?? undefined,
                        logo: input.logo,

                    },
                    include: {
                        tenantActivefields: {
                            include: {
                                field: true
                            }
                        }
                    }
                }),
                ctx.prisma.tenantActiveField.createMany({
                    data: input?.tenantActiveFields?.map(id => ({

                        tenantId: input.id,
                        fieldId: id,
                    })) ?? []
                })

            ])

            return tenant
        },
    }).mutation("delete", {
        input: z.object({
            id: z.string(),
        }),
        async resolve({ input, ctx }) {
            return await ctx.prisma.tenant.delete({
                where: {
                    id: input.id,
                },
            });
        }
    });
