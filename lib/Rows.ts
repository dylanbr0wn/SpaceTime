// import _ from "lodash";

// export type fieldOption = { [key: string]: string };

// export interface IRows {
//     get(_rows: fieldOption[][]): fieldOption[][];
//     withMatches(matchArr: fieldOption[]): IRows;
//     filter(filterRows: fieldOption[][]): IRows;
//     getOptions(_field: string): fieldOption[];
// }

// export const Rows = function (startRows: fieldOption[][] = []) {
//     let rows: fieldOption[][];

//     const obj = {
//         get(this: IRows, _rows: fieldOption[][]) {
//             if (rows) return rows;
//             const func = (
//                 i: number,
//                 vals: (fieldOption | fieldOption[])[] = []
//             ) => {
//                 if (i < _rows.length - 1) {
//                     return _rows[i].flatMap((a) => func(i + 1, [...vals, a]));
//                 } else if (i < _rows.length) {
//                     return _rows[i].map((a) => func(i + 1, [...vals, a]));
//                 } else {
//                     return vals;
//                 }
//             };
//             return func(0) as fieldOption[][];
//         },
//         withMatches(this: IRows, matchArr: fieldOption[]) {
//             rows = rows.filter((row) =>
//                 _.every(matchArr, (val) => _.some(row, val))
//             );
//             return this;
//         },
//         filter(this: IRows, _filterRows: fieldOption[][]) {
//             rows = rows.filter(
//                 (xrow) =>
//                     !_filterRows.some((used) =>
//                         _.isEmpty(_.xorWith(xrow, used, _.isEqual))
//                     )
//             );
//             return this;
//         },
//         getOptions(this: IRows, _field: string) {
//             const options = _.uniq<fieldOption>(
//                 _.flatMap(rows, (row) => row.filter((el) => el[_field]))
//             );
//             return options;
//         },
//     };

//     rows = obj.get(startRows);

//     return obj;
// };
