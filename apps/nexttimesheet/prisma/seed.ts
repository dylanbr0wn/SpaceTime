import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const tenantId = "cl3hvuu560013ymrmrno1j5sh";

const departmentData: Prisma.DepartmentCreateInput[] = [
    {
        name: "IT",
        description: "Information Technology",
        tenant: {
            connect: {
                id: tenantId,
            },
        },
        projects: {
            createMany: {
                data: [
                    {
                        name: "API",
                        tenantId,
                        description: "API Development",

                        code: "API",
                    },
                    {
                        name: "Frontend",
                        description: "Frontend Development",
                        code: "FRONTEND",
                        tenantId,
                    },
                ],
            },
        },
    },
    {
        name: "Finance",
        description: "Finance and stuff",
        tenant: {
            connect: {
                id: tenantId,
            },
        },
        projects: {
            createMany: {
                data: [
                    {
                        name: "Payroll",
                        tenantId,
                        description: "Process Payroll",

                        code: "PAY",
                    },
                    {
                        name: "SALARY",
                        description: "SALARY REVIEW",
                        code: "SALARY",
                        tenantId,
                    },
                ],
            },
        },
    },
    {
        name: "Parks",
        description: "Parks and Recreation",
        tenant: {
            connect: {
                id: tenantId,
            },
        },
        projects: {
            createMany: {
                data: [
                    {
                        name: "Maintenance",
                        tenantId,
                        description: "Parks Maintenance",

                        code: "MAINT",
                    },
                    {
                        name: "Gardens",
                        description: "Gardens Maintenance",
                        code: "GARDENS",
                        tenantId,
                    },
                ],
            },
        },
    },
];

const workTypeData: Prisma.WorkTypeCreateInput[] = [
    {
        name: "REGULAR",
        description: "Regular work",
        tenant: {
            connect: {
                id: tenantId,
            },
        },
        code: "REG",
    },
    {
        name: "OVERTIME",
        description: "Overtime work",
        tenant: {
            connect: {
                id: tenantId,
            },
        },
        code: "OT",
    },
];

async function main() {
    console.log(`Start seeding ...`);
    for (const dep of departmentData) {
        const department = await prisma.department.create({
            data: dep,
        });
        console.log(`Created dep with id: ${department.id}`);
    }
    for (const wt of workTypeData) {
        const workType = await prisma.workType.create({
            data: wt,
        });
        console.log(`Created work type with id: ${workType.id}`);
    }
    console.log(`Seeding finished.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
