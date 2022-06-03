import * as React from "react";

import { useQuery, useReactiveVar } from "@apollo/client";
import { useSpring } from "@react-spring/web";

import {
    FieldDocument,
    FieldOption,
    FieldQuery,
    shaker as shakerVar,
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

export const useShaker = (
    row: TimeEntryRow | undefined,
    field: FieldOption | null
) => {
    const shaker = useReactiveVar(shakerVar);
    const [shake, setShake] = React.useState(false);

    React.useEffect(() => {
        const animateOnOff = async () => {
            for (let i = 0; i < 2; i++) {
                setShake(true);
                await new Promise((resolve) => setTimeout(resolve, 150));
                setShake(false);
                await new Promise((resolve) => setTimeout(resolve, 150));
            }
        };
        if (!shaker) {
            return;
        }
        if (shaker[0] === row?.id && shaker[1] === field?.id) {
            animateOnOff();
            const timeoutId = window.setTimeout(() => {
                shakerVar(["", ""]);
            }, 150);
            return () => {
                window.clearTimeout(timeoutId);
            };
        }
    }, [shaker, row?.id, field?.id]);

    const styles = useSpring({
        x: shaker[0] === row?.id && shaker[1] === field?.id ? -5 : 0,
        config: {
            tension: 400,
            friction: 3,
            mass: 0.5,
        },
    });

    return { styles, shake, setShake };
};
