import { NextApiRequest, NextApiResponse } from "next";

import { PrismaClient } from "@prisma/client";

import prisma from "../../prisma";

export type Context = {
    prisma: PrismaClient;
};

export const createPrismaContext = async (
    req: NextApiRequest,
    res: NextApiResponse
): Promise<Context> => {
    return {
        prisma,
    };
};
