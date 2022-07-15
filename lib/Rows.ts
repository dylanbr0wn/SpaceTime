import _ from "lodash";

export type fieldOption = { [key: string]: string };

export interface IRows {
	_get(_rows: fieldOption[][]): fieldOption[][];
	getOptions(_field: string): fieldOption[];
	bind(
		this: IRows,
		transform: (rows: fieldOption[][]) => fieldOption[][]
	): IRows;
}

export const Rows = function (startRows: fieldOption[][] = []) {
	let rows: fieldOption[][];

	const obj = {
		_get(this: IRows, _rows: fieldOption[][]) {
			if (rows) return rows;
			//@ts-ignore
			const func = (i: number, vals: (fieldOption | fieldOption[])[] = []) => {
				if (i < _rows.length - 1) {
					//@ts-ignore
					return _rows[i]?.flatMap((a) => func(i + 1, [...vals, a]));
				} else if (i < _rows.length) {
					return _rows[i]?.map((a) => func(i + 1, [...vals, a]));
				} else {
					return vals;
				}
			};
			return func(0) as fieldOption[][];
		},
		bind(
			this: IRows,
			transform: (rows: fieldOption[][]) => fieldOption[][]
		): IRows {
			rows = transform(rows);

			return this;
		},

		getOptions(this: IRows, _field?: string) {
			const options = _.uniq<fieldOption>(
				_.flatMap(rows, (row) =>
					_field ? row.filter((el) => el[_field]) : row
				)
			);
			return options;
		},
	};

	rows = obj._get(startRows);

	return obj;
};
