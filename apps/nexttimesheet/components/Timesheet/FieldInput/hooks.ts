import * as React from "react";

import { useQuery, useReactiveVar } from "@apollo/client";

import {
    FieldDocument,
    FieldQuery,
    usedRows as usedRowsVar,
} from "../../../lib/apollo";
import { TimeEntryRow } from "../types";

export const useFieldOptions = (
    fieldId: string,
    row: TimeEntryRow | undefined,
    entryRowId: string | undefined
) => {
    const [fieldInfo, setFieldInfo] = React.useState<
        FieldQuery["field"] | undefined
    >();

    const { data: fieldData } = useQuery(FieldDocument, {
        variables: {
            id: fieldId,
        },
    });

    const usedRows = useReactiveVar(usedRowsVar);

    React.useEffect(() => {
        if (fieldData?.field) {
            setFieldInfo(fieldData?.field);
        }
    }, [fieldData, row, usedRows, entryRowId, fieldId]);

    return { fieldInfo };
};
