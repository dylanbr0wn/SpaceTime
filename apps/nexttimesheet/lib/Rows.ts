import _ from "lodash";

export interface IRows<T> {
    get(_rows: T[][]): T[][];
    withMatches(matchArr: T[]): IRows<T>;
    filter(filterRows: T[][]): IRows<T>;
}

export const Rows = function <T>(startRows: T[][] = []) {
    let rows: T[][];

    const obj = {
        get(this: IRows<T>, _rows: T[][]) {
            if (rows) return rows;
            const func = (i: number, vals: (T | T[])[] = []) => {
                if (i < _rows.length - 1) {
                    return _rows[i].flatMap((a) => func(i + 1, [...vals, a]));
                } else if (i < _rows.length) {
                    return _rows[i].map((a) => func(i + 1, [...vals, a]));
                } else {
                    return vals;
                }
            };
            return func(0) as T[][];
        },
        withMatches(this: IRows<T>, matchArr: T[]) {
            rows = rows.filter((row) =>
                row.some((el) => matchArr.includes(el))
            );
            return this;
        },
        filter(this: IRows<T>, _filterRows: T[][]) {
            rows = rows.filter(
                (xrow) =>
                    !_filterRows.some((used) => _.isEmpty(_.xor(xrow, used)))
            );
            return this;
        },
    };

    rows = obj.get(startRows);

    return obj;
};
