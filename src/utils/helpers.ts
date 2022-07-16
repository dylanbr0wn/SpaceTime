import { isNull } from "lodash";

//https://muffinman.io/blog/javascript-get-element-offset/
export function getElementOffset(el: HTMLElement | null) {
	let top = 0;
	let left = 0;
	let element: HTMLElement | null = el;

	// Loop through the DOM tree
	// and add it's parent's offset to get page offset

	while (element) {
		top += element.offsetTop || 0;
		left += element.offsetLeft || 0;
		element = element.parentElement;
	}

	return {
		top,
		left,
	};
}
