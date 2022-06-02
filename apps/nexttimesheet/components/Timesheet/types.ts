export interface TimeEntryRow {
    id: string;
    createdAt: string | Date;
    updatedAt: string | Date;
    rowOptions: {
        id: string;
        fieldOption: {
            id: string;
        };
    }[];
}
