import * as React from "react";
import { useSpring } from "@react-spring/web";
import { useStore } from "../../../utils/store";
import { trpc } from "../../../utils/trpc";
import { Field, FieldOption, TimeEntryRow } from "../../../utils/types/zod";

export const useFieldOptions = (
    fieldId: string,
    row: TimeEntryRow | undefined,
    entryRowId: string | undefined
) => {
    const [fieldInfo, setFieldInfo] = React.useState<
        Field & { fieldOptions: FieldOption[] }
    >();

    const { data: fieldData } = trpc.useQuery(["field.read", {
        id: fieldId,
    }]);

    const { usedRows } = useStore(state => ({
        usedRows: state.usedRows,
    }));

    React.useEffect(() => {
        if (fieldData) {
            setFieldInfo(fieldData);
        }
    }, [fieldData, row, usedRows, entryRowId, fieldId]);

    return { fieldInfo };
};

export const useShaker = (
    row: TimeEntryRow | undefined,
    field: FieldOption | null
) => {
    const { shaker, setShaker } = useStore(state => ({
        shaker: state.shaker,
        setShaker: state.setShaker,
    }));
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
                setShaker(["", ""]);
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

    return { styles, shake, setShake, setShaker };
};
