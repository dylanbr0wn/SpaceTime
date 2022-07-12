// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { entryCommentRouter } from "./entryComment";
import { userRouter } from "./user";
import { entryRowOptionRouter } from "./entryRowOption";
import { tenantRouter } from "./tenant";
import { timeEntryRouter } from "./timeEntry";
import { fieldRouter } from "./field";
import { fieldOptionRouter } from "./fieldOptions";
import { oneTimeTokenRouter } from "./oneTimeToken";
import { statusEventRouter } from "./statusEvents";
import { timeEntryRowRouter } from "./timeEntryRow";
import { timesheetRouter } from "./timesheet";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("entryComment.", entryCommentRouter)
  .merge("user.", userRouter)
  .merge("entryRowOption.", entryRowOptionRouter)
  .merge("tenant.", tenantRouter)
  .merge("timeEntry.", timeEntryRouter)
  .merge("field.", fieldRouter)
  .merge("fieldOptions.", fieldOptionRouter)
  .merge("oneTimeToken.", oneTimeTokenRouter)
  .merge("statusEvents.", statusEventRouter)
  .merge("timeEntryRow.", timeEntryRowRouter)
  .merge("timesheet.", timesheetRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
