import create, { StateCreator } from "zustand";

interface ITimesheetSlice {
	usedRows: { [key: string]: string[] };
	IsChanged: boolean;
	shaker: [string, string];
	setUsedRows: (usedRows: { [key: string]: string[] }) => void;
	setIsChanged: (isChanged: boolean) => void;
	setShaker: (shaker: [string, string]) => void;
	getRow: (rowId: string | undefined) => string[] | undefined;
}

const timesheetSlice: StateCreator<ITimesheetSlice> = (set, get) => ({
	usedRows: {},
	IsChanged: false,
	shaker: ["", ""],
	setUsedRows: (usedRows: { [key: string]: string[] }) =>
		set(() => ({ usedRows })),
	setIsChanged: (IsChanged: boolean) => set(() => ({ IsChanged })),
	setShaker: (shaker: [string, string]) => set(() => ({ shaker })),
	getRow: (rowId: string | undefined) => {
		if (!rowId) return [];
		return get().usedRows[rowId];
	},
});

interface IManageSlice {
	currentMenuHover: string;
	setCurrentMenuHover: (currentMenuHover: string) => void;
	currentMenuActive: string;
	setCurrentMenuActive: (currentMenuHover: string) => void;
}

const manageSlice: StateCreator<IManageSlice> = (set, get) => ({
	currentMenuActive: "dashboard",
	setCurrentMenuActive: (currentMenuActive: string) =>
		set(() => ({ currentMenuActive })),
	currentMenuHover: "",
	setCurrentMenuHover: (currentMenuHover: string) =>
		set(() => ({ currentMenuHover })),
});

export const useStore = create<ITimesheetSlice & IManageSlice>((...a) => ({
	...timesheetSlice(...a),
	...manageSlice(...a),
}));
