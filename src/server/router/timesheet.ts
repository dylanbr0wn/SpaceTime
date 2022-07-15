import { createRouter } from "./context";
import { z } from "zod";
import {
	zEntryComment,
	zTimeEntry,
	zTimeEntryRow,
	zTimesheet,
} from "../../utils/types/zod";
import { Z_DATA_ERROR } from "zlib";
import { DateTime, Interval } from "luxon";

export const timesheetRouter = createRouter()
	.query("read", {
		input: z.object({
			id: z.string(),
		}),
		output: zTimesheet,
		async resolve({ input, ctx }) {
			return await ctx.prisma.timesheet.findUniqueOrThrow({
				where: {
					id: input.id,
				},
				include: {
					timeEntryRows: {
						select: {
							id: true,
							updatedAt: true,
							timeEntries: {
								select: {
									id: true,
									updatedAt: true,
								},
							},
						},
					},
				},
			});
		},
	})
	.query("readFromDate", {
		input: z.object({
			userId: z.string(),
			date: z.date(),
		}),
		output: zTimesheet,
		async resolve({ input, ctx }) {
			const user = await ctx.prisma.user.findUnique({
				where: {
					id: input.userId,
				},
				include: {
					tenant: {
						select: {
							id: true,
							startDate: true,
							periodLength: true,
							tenantActivefields: {
								select: {
									fieldId: true,
								},
							},
						},
					},
				},
			});
			if (!user) throw new Error("Cant find user!");
			if (!user.tenant) throw new Error("Cant find tenant!");
			let period = await ctx.prisma.period.findFirst({
				where: {
					startDate: {
						lte: input.date,
					},
					endDate: {
						gt: input.date,
					},
					tenantId: user.tenant.id,
				},
			});

			if (!period && user?.tenant && user?.tenantId) {
				// got prefs, find the period params
				const timesheetDate = DateTime.fromJSDate(input.date);
				const { startDate, periodLength } = user.tenant;
				let interval = Interval.after(startDate, {
					days: periodLength,
				});
				while (!interval.contains(timesheetDate)) {
					interval = interval.mapEndpoints((endpoints) =>
						endpoints.plus({ days: periodLength })
					);
					if (
						interval.start.year >
						timesheetDate.plus({
							years: 5,
						}).year
					) {
						throw new Error("Cant find date interval");
					}
				}
				// now have period interval, create period

				period = await ctx.prisma.period.create({
					data: {
						startDate: interval.start.toJSDate(),
						endDate: interval.end.toJSDate(),
						tenant: {
							connect: {
								id: user?.tenantId,
							},
						},
					},
				});
			}
			if (!period) throw new Error("Could not find or create period");
			// now have period, find or create timesheet

			return await ctx.prisma.timesheet.upsert({
				where: {
					userId_periodId: {
						userId: input.userId,
						periodId: period.id,
					},
				},
				update: {},
				create: {
					user: {
						connect: {
							id: input.userId,
						},
					},
					period: {
						connect: {
							id: period.id,
						},
					},
					timesheetFields: {
						create: user?.tenant?.tenantActivefields?.map((field) => ({
							fieldId: field.fieldId,
						})),
					},
				},
				include: {
					period: {
						select: {
							id: true,
							startDate: true,
							endDate: true,
						},
					},
					timesheetFields: {
						select: {
							field: {
								select: {
									id: true,
									name: true,
								},
							},
						},
					},
				},
			});
		},
	})
	.query("readFromAuth", {
		input: z.object({
			authId: z.string(),
			date: z.date(),
		}),
		async resolve({ input, ctx }) {
			let [user, period] = await Promise.all([
				ctx.prisma.user.findUnique({
					where: {
						authId: input.authId,
					},
					include: {
						tenant: {
							select: {
								id: true,
								startDate: true,
								periodLength: true,
								tenantActivefields: {
									select: {
										fieldId: true,
									},
								},
							},
						},
					},
				}),
				ctx.prisma.period.findFirst({
					where: {
						startDate: {
							lte: input.date,
						},
						endDate: {
							gt: input.date,
						},
						tenant: {
							users: {
								some: {
									authId: input.authId,
								},
							},
						},
					},
				}),
			]);

			if (!user) throw new Error("Cant find user!");
			if (!user.tenant) throw new Error("Cant find tenant!");

			if (!period && user?.tenant && user?.tenantId) {
				// got prefs, find the period params
				const timesheetDate = DateTime.fromJSDate(input.date);
				const { startDate, periodLength } = user.tenant;
				let interval = Interval.after(startDate, {
					days: periodLength,
				});
				while (!interval.contains(timesheetDate)) {
					interval = interval.mapEndpoints((endpoints) =>
						endpoints.plus({ days: periodLength })
					);
					if (
						interval.start.year >
						timesheetDate.plus({
							years: 5,
						}).year
					) {
						throw new Error("Cant find date interval");
					}
				}
				// now have period interval, create period

				period = await ctx.prisma.period.create({
					data: {
						startDate: interval.start.toJSDate(),
						endDate: interval.end.toJSDate(),
						tenant: {
							connect: {
								id: user?.tenantId,
							},
						},
					},
				});
			}
			if (!period) throw new Error("Could not find or create period");
			// now have period, find or create timesheet

			return await ctx.prisma.timesheet.upsert({
				where: {
					userAuthId_periodId: {
						userAuthId: input.authId,
						periodId: period.id,
					},
				},
				update: {},
				create: {
					user: {
						connect: {
							authId: input.authId,
						},
					},
					period: {
						connect: {
							id: period.id,
						},
					},
					timesheetFields: {
						create: user?.tenant?.tenantActivefields?.map((field) => ({
							fieldId: field.fieldId,
						})),
					},
				},
				include: {
					user: {
						select: {
							id: true,
							tenant: {
								select: {
									id: true,
								},
							},
						},
					},
					period: {
						select: {
							id: true,
							startDate: true,
							endDate: true,
						},
					},
					timesheetFields: {
						select: {
							field: {
								select: {
									id: true,
									name: true,
								},
							},
						},
					},
				},
			});
		},
	})
	.mutation("update", {
		input: z.object({
			id: z.string(),
			isChanged: z.boolean(),
		}),
		async resolve({ input, ctx }) {
			return await ctx.prisma.timesheet.update({
				where: {
					id: input.id,
				},
				data: {
					isChanged: input.isChanged,
				},
				select: {
					id: true,
					updatedAt: true,
					isChanged: true,
				},
			});
		},
	});
