import { createRouter } from "./context";
import { z } from "zod";
import { zEntryRowOption, zOneTimeToken } from "../../utils/types/zod";

export const oneTimeTokenRouter = createRouter()
	.query("read", {
		input: z
			.object({
				id: z.string(),
			})
			.required(),
		output: zOneTimeToken,
		async resolve({ input, ctx }) {
			return await ctx.prisma.oneTimeToken.findUniqueOrThrow({
				where: {
					id: input?.id,
				},
			});
		},
	})
	.query("readAll", {
		input: z
			.object({
				tenantId: z.string(),
			})
			.required(),
		output: z.array(zOneTimeToken),
		async resolve({ input, ctx }) {
			return await ctx.prisma.oneTimeToken.findMany({
				where: {
					tenant: {
						id: input.tenantId,
					},
				},
				include: {
					user: {
						select: {
							id: true,
							avatar: true,
							name: true,
						},
					},
				},
			});
		},
	})
	.mutation("create", {
		input: z.object({
			userId: z.string(),
			tenantId: z.string(),
		}),
		output: zOneTimeToken,
		async resolve({ input, ctx }) {
			return await ctx.prisma.oneTimeToken.create({
				data: {
					user: {
						connect: {
							id: input.userId,
						},
					},
					tenant: {
						connect: {
							id: input.tenantId,
						},
					},
				},
				include: {
					user: {
						select: {
							id: true,
						},
					},
					tenant: {
						select: {
							id: true,
						},
					},
				},
			});
		},
	});
