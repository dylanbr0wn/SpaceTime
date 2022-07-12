import create from "zustand"


interface IState {
    usedRows: { [key: string]: string[] }
    IsChanged: boolean
    shaker: [string, string]
    setUsedRows: (usedRows: { [key: string]: string[] }) => void
    setIsChanged: (isChanged: boolean) => void
    setShaker: (shaker: [string, string]) => void
}

export const useStore = create<IState>(set => ({
    usedRows: {},
    IsChanged: false,
    shaker: ["", ""],
    setUsedRows: (usedRows: { [key: string]: string[] }) => set(() => ({ usedRows })),
    setIsChanged: (IsChanged: boolean) => set(() => ({ IsChanged })),
    setShaker: (shaker: [string, string]) => set(() => ({ shaker })),

}))