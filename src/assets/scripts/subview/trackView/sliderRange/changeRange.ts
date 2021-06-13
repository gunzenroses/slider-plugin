function changeRange(object: HTMLElement, newThumbCurrent: number, ifHorizontal: boolean, ifThumbFirst: boolean, ifFirst: boolean){
    ifThumbFirst
        ? ifHorizontal
                ? (ifFirst 
                    ? object.style.left = newThumbCurrent + "%"
                    : object.style.right = (100 - newThumbCurrent) + "%")
                : (ifFirst 
                    ? object.style.bottom = newThumbCurrent + "%"
                    : object.style.top = (100 - newThumbCurrent) + "%")
        : ifHorizontal
                ? object.style.right = (100 - newThumbCurrent) + "%"
                : object.style.top = (100 - newThumbCurrent) + "%";
    return object;
}

export { changeRange }