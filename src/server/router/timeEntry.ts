import { createRouter } from "./context";
import { z } from "zod";
import { zEntryComment, zTenant, zTimeEntry } from "../../utils/types/zod";

export const timeEntryRouter = createRouter()
	.query("read", {
		input: z.object({
			timeEntryRowId: z.string(),
			index: z.number(),
		}),
		async resolve({ input, ctx }) {
			return await ctx.prisma.timeEntry.findUnique({
				where: {
					index_timeEntryRowId: {
						index: input.index,
						timeEntryRowId: input.timeEntryRowId,
					},
				},
				include: {
					entryComments: {
						select: {
							id: true,
						},
					},
				},
			});
		},
	})
	.query("readAllInRow", {
		input: z.object({
			rowId: z.string(),
		}),
		async resolve({ input, ctx }) {
			return await ctx.prisma.timeEntry.findMany({
				where: {
					timeEntryRowId: input.rowId,
				},
				include: {
					entryComments: {
						select: {
							id: true,
						},
					},
				},
			});
		},
	})
	.mutation("create", {
		input: z.object({
			timeEntryRowId: z.string(),
			index: z.number(),
			hours: z.number(),
			date: z.date(),
		}),
		async resolve({ input, ctx }) {
			return await ctx.prisma.timeEntry.create({
				data: {
					...input,
				},
				include: {
					entryComments: {
						select: {
							id: true,
						},
					},
				},
			});
		},
	})
	.mutation("update", {
		input: z.object({
			id: z.string(),
			hours: z.number(),
		}),
		async resolve({ input, ctx }) {
			return await ctx.prisma.timeEntry.update({
				where: {
					id: input.id,
				},
				data: {
					hours: input.hours,
				},
				include: {
					entryComments: {
						select: {
							id: true,
						},
					},
				},
			});
		},
	})
	.mutation("delete", {
		input: z.object({
			id: z.string(),
		}),
		async resolve({ input, ctx }) {
			return await ctx.prisma.timeEntry.delete({
				where: {
					id: input.id,
				},
			});
		},
	});
