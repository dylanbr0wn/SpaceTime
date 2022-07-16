import { createRouter } from "./context";
import { z } from "zod";
import { zUser } from "../../utils/types/zod";

export const userRouter = createRouter()
	.query("read", {
		input: z.object({
			id: z.string(),
		}),
		output: zUser,
		async resolve({ input, ctx }) {
			return await ctx.prisma.user.findUniqueOrThrow({
				where: {
					id: input.id,
				},
			});
		},
	})
	.query("readAll", {
		input: z.object({
			tenantId: z.string(),
		}),
		output: z.array(zUser),
		async resolve({ ctx, input }) {
			return await ctx.prisma.user.findMany({
				where: {
					tenant: {
						id: input.tenantId,
					},
				},
				include: {
					tenant: {
						select: {
							id: true,
							name: true,
						},
					},
					managees: {
						select: {
							id: true,
							name: true,
							email: true,
							avatar: true,
						},
					},
					manager: {
						select: {
							id: true,
							name: true,
							email: true,
						},
					},
				},
			});
		},
	})
	.query("readFromToken", {
		input: z.object({
			token: z.string(),
		}),
		async resolve({ ctx, input }) {
			const user = await ctx.prisma.oneTimeToken.findUniqueOrThrow({
				where: {
					id: input.token,
				},
				select: {
					user: {
						include: {
							tenant: true,
						},
					},
				},
			});
			if (!user) {
				throw new Error("Invalid token");
			}
			return user?.user;
		},
	})
	.query("readFromAuth", {
		input: z.object({
			authId: z.string(),
		}),
		async resolve({ ctx, input }) {
			return await ctx.prisma.user.findUniqueOrThrow({
				where: {
					authId: input?.authId,
				},
				include: {
					tenant: true,
				},
			});
		},
	})
	.query("readManagers", {
		input: z.object({
			tenantId: z.string(),
		}),
		async resolve({ ctx, input }) {
			return await ctx.prisma.user.findMany({
				where: {
					tenant: {
						id: input.tenantId,
					},
					isManager: true,
				},
				select: {
					id: true,
					name: true,
				},
			});
		},
	})
	.mutation("create", {
		input: zUser.omit({ id: true }),
		output: zUser,
		async resolve({ ctx, input }) {
			return await ctx.prisma.user.create({
				data: {
					isActive: input.isActive ?? undefined,
					isAdmin: input.isAdmin ?? undefined,
					isManager: input.isManager ?? undefined,
					isPaymentManager: input.isPaymentManager ?? undefined,
					isSetup: input.isSetup ?? undefined,
					name: input.name,
					email: input.email,
					authId: input.authId,
					avatar: input.avatar,
					code: input.code,
					tenantId: input.tenantId ?? undefined,
				},
			});
		},
	})
	.mutation("createBasic", {
		input: z.object({
			name: z.string(),
			email: z.string(),
			authId: z.string(),
			tenantId: z.string(),
			avatar: z.string().optional(),
		}),
		output: zUser,
		async resolve({ ctx, input }) {
			return await ctx.prisma.user.create({
				data: {
					name: input.name,
					email: input.email,
					authId: input.authId,
					avatar: input.avatar,
					tenant: {
						connect: {
							id: input.tenantId,
						},
					},
				},
			});
		},
	})
	.mutation("update", {
		input: zUser.partial(),
		output: zUser,
		async resolve({ ctx, input }) {
			return await ctx.prisma.user.update({
				where: {
					id: input.id,
				},
				data: {
					isActive: input.isActive ?? undefined,
					isAdmin: input.isAdmin ?? undefined,
					isManager: input.isManager ?? undefined,
					isPaymentManager: input.isPaymentManager ?? undefined,
					isSetup: input.isSetup ?? undefined,
					name: input.name,
					email: input.email ?? undefined,
					authId: input.authId,
					avatar: input.avatar,
					code: input.code,
					tenantId: input.tenantId ?? undefined,
					managerId: input.managerId ?? undefined,
				},
			});
		},
	});
