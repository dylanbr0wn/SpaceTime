export interface TimeEntryRow {
    id: string;
    project: {
        id: string;
    };
    workType: {
        id: string;
    };
    department: {
        id: string;
    };
    createdAt: string | Date;
    updatedAt: string | Date;
}
