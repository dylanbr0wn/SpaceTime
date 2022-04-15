import path from "path";

import { DateTimeResolver } from "graphql-scalars";
import {
    arg,
    asNexusMethod,
    enumType,
    inputObjectType,
    intArg,
    list,
    makeSchema,
    nonNull,
    objectType,
    queryType,
    stringArg,
} from "nexus";
import * as NexusPrisma from "nexus-prisma";

import { Context } from "./context";

export const DateTime = asNexusMethod(DateTimeResolver, "date");

const allUsersQuery = queryType({
    definition(t) {
        t.nonNull.list.nonNull.field("allUsers", {
            type: "User",
            resolve: (_parent, _args, context: Context) => {
                return context.prisma.user.findMany();
            },
        });
        t.field("timesheet", {
            type: Timesheet,
            args: {
                periodId: intArg(),
                userId: intArg(),
            },
            resolve: (_parent, args, context: Context) => {
                return context.prisma.timesheet.findFirst({
                    where: {
                        period: {
                            id: args.periodId,
                        },
                        user: {
                            id: args.userId,
                        },
                    },
                });
            },
        });
    },
});

// const Mutation = objectType({
//     name: "Mutation",
//     definition(t) {
//         t.nonNull.field("signupUser", {
//             type: "User",
//             args: {
//                 data: nonNull(
//                     arg({
//                         type: "UserCreateInput",
//                     })
//                 ),
//             },
//             resolve: (_, args, context: Context) => {
//                 const postData = args.data.posts?.map((post) => {
//                     return {
//                         title: post.title,
//                         content: post.content || undefined,
//                     };
//                 });
//                 return context.prisma.user.create({
//                     data: {
//                         name: args.data.name,
//                         email: args.data.email,
//                         posts: {
//                             create: postData,
//                         },
//                     },
//                 });
//             },
//         });
//     },
// });

const Profile = objectType({
    name: NexusPrisma.Profile.$name,
    description: NexusPrisma.Profile.$description,
    definition(t) {
        t.field(NexusPrisma.Profile.id);
        t.field(NexusPrisma.Profile.lastName);
        t.field(NexusPrisma.Profile.firstName);
        t.field(NexusPrisma.Profile.avatar);
        t.field(NexusPrisma.Profile.bio);
    },
});

const User = objectType({
    name: NexusPrisma.User.$name,
    description: NexusPrisma.User.$description,
    definition(t) {
        t.field(NexusPrisma.User.id);
        t.field(NexusPrisma.User.email);
        t.field(NexusPrisma.User.code);
        t.field(NexusPrisma.User.isActive);
        t.field(NexusPrisma.User.isAdmin);
        t.field(NexusPrisma.User.profile);
        t.field(NexusPrisma.User.createdAt);
        t.field(NexusPrisma.User.updatedAt);
        t.field(NexusPrisma.User.department);
        t.field(NexusPrisma.User.managees);
        t.field(NexusPrisma.User.manager);
        t.field(NexusPrisma.User.isPaymentManager);
        t.field(NexusPrisma.User.isManager);
    },
});

const Department = objectType({
    name: NexusPrisma.Department.$name,
    description: NexusPrisma.Department.$description,
    definition(t) {
        t.field(NexusPrisma.Department.id);
        t.field(NexusPrisma.Department.name);
        t.field(NexusPrisma.Department.createdAt);
        t.field(NexusPrisma.Department.updatedAt);
        t.field(NexusPrisma.Department.users);
        t.field(NexusPrisma.Department.isActive);
        t.field(NexusPrisma.Department.description);
        t.field(NexusPrisma.Department.projects);
    },
});

const WorkType = objectType({
    name: NexusPrisma.WorkType.$name,
    description: NexusPrisma.WorkType.$description,
    definition(t) {
        t.field(NexusPrisma.WorkType.id);
        t.field(NexusPrisma.WorkType.name);
        t.field(NexusPrisma.WorkType.createdAt);
        t.field(NexusPrisma.WorkType.updatedAt);
        t.field(NexusPrisma.WorkType.isActive);
        t.field(NexusPrisma.WorkType.description);
        t.field(NexusPrisma.WorkType.code);
        t.field(NexusPrisma.WorkType.isSystem);
        t.field(NexusPrisma.WorkType.isDefault);
        t.field(NexusPrisma.WorkType.multiplier);
        t.field(NexusPrisma.WorkType.isBillable);
    },
});

const Project = objectType({
    name: NexusPrisma.Project.$name,
    description: NexusPrisma.Project.$description,
    definition(t) {
        t.field(NexusPrisma.Project.id);
        t.field(NexusPrisma.Project.name);
        t.field(NexusPrisma.Project.createdAt);
        t.field(NexusPrisma.Project.updatedAt);
        t.field(NexusPrisma.Project.isActive);
        t.field(NexusPrisma.Project.description);
        t.field(NexusPrisma.Project.code);
        t.field(NexusPrisma.Project.department);
    },
});

const TimeEntry = objectType({
    name: NexusPrisma.TimeEntry.$name,
    description: NexusPrisma.TimeEntry.$description,
    definition(t) {
        t.field(NexusPrisma.TimeEntry.id);
        t.field(NexusPrisma.TimeEntry.createdAt);
        t.field(NexusPrisma.TimeEntry.updatedAt);
        t.field(NexusPrisma.TimeEntry.date);
        t.field(NexusPrisma.TimeEntry.hours);
        t.field(NexusPrisma.TimeEntry.user);
        t.field(NexusPrisma.TimeEntry.workType);
        t.field(NexusPrisma.TimeEntry.project);
        t.field(NexusPrisma.TimeEntry.user);
        t.field(NexusPrisma.TimeEntry.hours);
        t.field(NexusPrisma.TimeEntry.date);
        t.field(NexusPrisma.TimeEntry.department);
        t.field(NexusPrisma.TimeEntry.entryComments);
    },
});

const TimeEntryRow = objectType({
    name: NexusPrisma.TimeEntryRow.$name,
    description: NexusPrisma.TimeEntryRow.$description,
    definition(t) {
        t.field(NexusPrisma.TimeEntryRow.id);
        t.field(NexusPrisma.TimeEntryRow.createdAt);
        t.field(NexusPrisma.TimeEntryRow.updatedAt);
        t.field(NexusPrisma.TimeEntryRow.date);
        t.field(NexusPrisma.TimeEntryRow.user);
        t.field(NexusPrisma.TimeEntryRow.workType);
        t.field(NexusPrisma.TimeEntryRow.project);
        t.field(NexusPrisma.TimeEntryRow.department);
        t.field(NexusPrisma.TimeEntryRow.timeEntries);
    },
});

const Period = objectType({
    name: NexusPrisma.Period.$name,
    description: NexusPrisma.Period.$description,
    definition(t) {
        t.field(NexusPrisma.Period.id);
        t.field(NexusPrisma.Period.createdAt);
        t.field(NexusPrisma.Period.startDate);
        t.field(NexusPrisma.Period.endDate);
    },
});

const EntryComment = objectType({
    name: NexusPrisma.EntryComment.$name,
    description: NexusPrisma.EntryComment.$description,
    definition(t) {
        t.field(NexusPrisma.EntryComment.id);
        t.field(NexusPrisma.EntryComment.createdAt);
        t.field(NexusPrisma.EntryComment.updatedAt);
        t.field(NexusPrisma.EntryComment.text);
    },
});

const Timesheet = objectType({
    name: NexusPrisma.Timesheet.$name,
    definition(t) {
        t.field(NexusPrisma.Timesheet.id);
        t.field(NexusPrisma.Timesheet.createdAt);
        t.field(NexusPrisma.Timesheet.updatedAt);
        t.field(NexusPrisma.Timesheet.period);
        t.field(NexusPrisma.Timesheet.user);
        t.field(NexusPrisma.Timesheet.timeEntryRows);
    },
});

// const SortOrder = enumType({
//     name: "SortOrder",
//     members: ["asc", "desc"],
// });

// const PostOrderByUpdatedAtInput = inputObjectType({
//     name: "PostOrderByUpdatedAtInput",
//     definition(t) {
//         t.nonNull.field("updatedAt", { type: "SortOrder" });
//     },
// });

// const UserUniqueInput = inputObjectType({
//     name: "UserUniqueInput",
//     definition(t) {
//         t.int("id");
//         t.string("email");
//     },
// });

// const PostCreateInput = inputObjectType({
//     name: "PostCreateInput",
//     definition(t) {
//         t.nonNull.string("title");
//         t.string("content");
//     },
// });

// const UserCreateInput = inputObjectType({
//     name: "UserCreateInput",
//     definition(t) {
//         t.nonNull.string("email");
//         t.string("name");
//         t.list.nonNull.field("posts", { type: "PostCreateInput" });
//     },
// });

export const schema = makeSchema({
    types: [
        allUsersQuery,
        Timesheet,
        User,
        Department,
        WorkType,
        Period,
        Profile,
        Project,
        TimeEntry,
        TimeEntryRow,
        EntryComment,
        DateTime,
    ],
    outputs: {
        schema: path.join(__dirname, "/../schema.graphql"),
        typegen: path.join(__dirname, "/generated/nexus.ts"),
    },
    contextType: {
        module: require.resolve("./context"),
        export: "Context",
    },
    sourceTypes: {
        modules: [
            {
                module: "@prisma/client",
                alias: "prisma",
            },
        ],
    },
});
