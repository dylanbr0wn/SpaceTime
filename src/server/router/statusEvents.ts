import { createRouter } from "./context";
import { z } from "zod";
import { zEventType, zStatus, zStatusEvent } from "../../utils/types/zod";

export const statusEventRouter = createRouter()
	.query("readAll", {
		input: z
			.object({
				timesheetId: z.string(),
			})
			.required(),
		async resolve({ input, ctx }) {
			return await ctx.prisma.statusEvent.findMany({
				where: {
					timesheet: {
						id: input.timesheetId,
					},
				},
				include: {
					user: {
						select: {
							name: true,
							avatar: true,
						},
					},
				},
			});
		},
	})
	.mutation("create", {
		input: z.object({
			timesheetId: z.string(),
			status: zStatus,
			message: z.string(),
			userId: z.string(),
			type: zEventType,
		}),
		async resolve({ input, ctx }) {
			const [statusEvent] = await Promise.all([
				await ctx.prisma.statusEvent.create({
					data: {
						timesheet: {
							connect: {
								id: input.timesheetId,
							},
						},
						status: input.status,
						message: input.message,
						user: {
							connect: {
								id: input.userId,
							},
						},
						type: input.type,
					},
					include: {
						user: {
							select: {
								name: true,
								avatar: true,
							},
						},
					},
				}),
				await ctx.prisma.timesheet.update({
					where: {
						id: input.timesheetId,
					},
					data: {
						status: input.status,
						isChanged: false,
					},
				}),
			]);
			return statusEvent;
		},
	});
