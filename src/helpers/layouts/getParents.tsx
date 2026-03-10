export const getParents = (
    el: Element,
    selector?: string,
    filter?: string
): Element[] => {
    // If no selector defined, stop at document
    const parentSelector = selector
        ? document.querySelector(selector)
        : document;

    const parents: Element[] = [];
    let pNode = el.parentNode;

    // Traverse up the DOM tree until we reach the parent selector or null
    while (pNode !== null && pNode !== parentSelector) {
        // TypeScript: Cast to Element since we need classList
        const element = pNode as Element;

        if (filter === undefined) {
            parents.push(element);
        } else {
            if (element.classList.contains(filter)) {
                parents.push(element);
            }
        }

        pNode = element.parentNode;
    }

    return parents;
};