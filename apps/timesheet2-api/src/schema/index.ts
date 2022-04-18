import path from "path";

import { DateTimeResolver } from "graphql-scalars";
import { asNexusMethod, makeSchema } from "nexus";

import * as Department from "./Department";
import * as EntryComment from "./EntryComment";
import * as Period from "./Period";
import * as Profile from "./Profile";
import * as Project from "./Project";
import * as TimeEntry from "./TimeEntry";
import * as TimeEntryRow from "./TimeEntryRow";
import * as Timesheet from "./Timesheet";
import * as User from "./User";
import * as Worktype from "./WorkType";

// const allUsersQuery = queryType({
//     definition(t) {
//         t.nonNull.list.nonNull.field("allUsers", {
//             type: "User",
//             resolve: (_parent, _args, context: Context) => {
//                 return context.prisma.user.findMany();
//             },
//         });
//     },
// });

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
export const DateTime = asNexusMethod(DateTimeResolver, "date"); // it will break without this....b
export const schema = makeSchema({
    types: {
        Department,
        EntryComment,
        Period,
        Profile,
        Project,
        TimeEntry,
        TimeEntryRow,
        Timesheet,
        User,
        Worktype,
        DateTime,
    },
    outputs: {
        schema: path.join(__dirname, "/../schema.graphql"),
        typegen: path.join(
            __dirname,
            "../../node_modules/@types/nexus-typegen/index.d.ts"
        ),
    },
    contextType: {
        module: require.resolve("../context"),
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
