import create from "zustand"


interface IState {
    usedRows: { [key: string]: string[] }
    IsChanged: boolean
    shaker: [string, string]
    setUsedRows: (usedRows: { [key: string]: string[] }) => void
    setIsChanged: (isChanged: boolean) => void
    setShaker: (shaker: [string, string]) => void
    getRow: (rowId: string | undefined) => string[] | undefined
}

export const useStore = create<IState>((set, get) => ({
    usedRows: {},
    IsChanged: false,
    shaker: ["", ""],
    setUsedRows: (usedRows: { [key: string]: string[] }) => set(() => ({ usedRows })),
    setIsChanged: (IsChanged: boolean) => set(() => ({ IsChanged })),
    setShaker: (shaker: [string, string]) => set(() => ({ shaker })),
    getRow: (rowId: string | undefined) => {
        if (!rowId) return []
        return get().usedRows[rowId]
    }

}))