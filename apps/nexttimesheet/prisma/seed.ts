import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const departmentData: Prisma.DepartmentCreateInput[] = [
    {
        name: "IT",
        description: "Information Technology",
        tenant: {
            connect: {
                id: "cl3goltrx059145lkkzhknirz",
            },
        },
        projects: {
            createMany: {
                data: [
                    {
                        name: "API",
                        tenantId: "cl3goltrx059145lkkzhknirz",
                        description: "API Development",

                        code: "API",
                    },
                    {
                        name: "Frontend",
                        description: "Frontend Development",
                        code: "FRONTEND",
                        tenantId: "cl3goltrx059145lkkzhknirz",
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
                id: "cl3goltrx059145lkkzhknirz",
            },
        },
        projects: {
            createMany: {
                data: [
                    {
                        name: "Payroll",
                        tenantId: "cl3goltrx059145lkkzhknirz",
                        description: "Process Payroll",

                        code: "PAY",
                    },
                    {
                        name: "SALARY",
                        description: "SALARY REVIEW",
                        code: "SALARY",
                        tenantId: "cl3goltrx059145lkkzhknirz",
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
                id: "cl3goltrx059145lkkzhknirz",
            },
        },
        projects: {
            createMany: {
                data: [
                    {
                        name: "Maintenance",
                        tenantId: "cl3goltrx059145lkkzhknirz",
                        description: "Parks Maintenance",

                        code: "MAINT",
                    },
                    {
                        name: "Gardens",
                        description: "Gardens Maintenance",
                        code: "GARDENS",
                        tenantId: "cl3goltrx059145lkkzhknirz",
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
                id: "cl3goltrx059145lkkzhknirz",
            },
        },
        code: "REG",
    },
    {
        name: "OVERTIME",
        description: "Overtime work",
        tenant: {
            connect: {
                id: "cl3goltrx059145lkkzhknirz",
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
