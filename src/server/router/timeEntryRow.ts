import { createRouter } from "./context";
import { z } from "zod";
import {
	zEntryComment,
	zTimeEntry,
	zTimeEntryRow,
} from "../../utils/types/zod";

export const timeEntryRowRouter = createRouter()
	.query("read", {
		input: z.object({
			id: z.string(),
		}),
		async resolve({ input, ctx }) {
			return await ctx.prisma.timeEntryRow.findUniqueOrThrow({
				where: {
					id: input.id,
				},
				include: {
					entryRowOptions: {
						select: {
							id: true,
							fieldId: true,
							fieldOption: {
								select: {
									id: true,
								},
							},
						},
					},
					timeEntries: {
						include: {
							entryComments: {
								select: {
									id: true,
								},
							},
						},
					},
				},
			});
		},
	})
	.query("readAll", {
		input: z.object({
			timesheetId: z.string(),
		}),
		async resolve({ input, ctx }) {
			return await ctx.prisma.timeEntryRow.findMany({
				where: {
					timesheet: {
						id: input.timesheetId,
					},
				},
				include: {
					entryRowOptions: {
						select: {
							id: true,
							fieldId: true,
							fieldOption: {
								select: {
									id: true,
								},
							},
						},
					},
				},
			});
		},
	})
	.mutation("create", {
		input: z.object({
			timesheetId: z.string(),
		}),
		async resolve({ input, ctx }) {
			return await ctx.prisma.timeEntryRow.create({
				data: {
					timesheetId: input.timesheetId,
				},
				include: {
					entryRowOptions: {
						select: {
							id: true,
							fieldId: true,
							fieldOption: {
								select: {
									id: true,
								},
							},
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
			const entries = await ctx.prisma.timeEntry.findMany({
				where: { timeEntryRowId: input.id },
				select: {
					entryComments: true,
				},
			});

			await Promise.all(
				entries.map(async (entry) => {
					return Promise.all(
						entry.entryComments.map(async (entryComment) => {
							ctx.prisma.entryComment.delete({
								where: {
									id: entryComment.id,
								},
							});
						})
					);
				})
			);
			await Promise.all([
				ctx.prisma.entryRowOption.deleteMany({
					where: {
						timeEntryRowId: input.id,
					},
				}),
				ctx.prisma.timeEntry.deleteMany({
					where: { timeEntryRowId: input.id },
				}),
			]);
			return await ctx.prisma.timeEntryRow.delete({
				where: {
					id: input.id,
				},
				select: {
					id: true,
				},
			});
		},
	});
