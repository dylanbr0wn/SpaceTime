import { createRouter } from "./context";
import { z } from "zod";
import { zEntryComment } from "../../utils/types/zod";

export const entryCommentRouter = createRouter()
  .query("read", {
    input: z
      .object({
        id: z.string(),
      }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.entryComment.findUniqueOrThrow({
        where: {
          id: input.id,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            }
          }
        }
      });
    },
  })
  .query("readAll", {
    input: z
      .object({
        entryId: z.string(),
      }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.entryComment.findMany({
        where: {
          timeEntry: {
            id: input.entryId,
          },
        },
      });
    },
  }).mutation("create", {
    input: z.object({
      text: z.string(),
      userId: z.string(),
      entryId: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.entryComment.create({
        data: {
          text: input.text,
          user: {
            connect: {
              id: input.userId,
            },
          },
          timeEntry: {
            connect: {
              id: input.entryId,
            },
          },

        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true,
            }
          }
        }
      })
    }
  }).mutation("update", {
    input: z.object({
      text: z.string(),
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.entryComment.update({
        where: {
          id: input.id,
        },
        data: {
          text: input.text,
        },
      })
    }
  }).mutation('delete', {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      return await ctx.prisma.entryComment.delete({
        where: {
          id: input.id,
        },
      })
    }
  });
