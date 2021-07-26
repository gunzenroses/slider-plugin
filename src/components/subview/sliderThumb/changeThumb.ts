function changeThumb(object: any, ifHorizontal: boolean, newThumbCurrent: number){
    ifHorizontal
                ? object.style.left = newThumbCurrent + "%"
                : object.style.bottom = newThumbCurrent + "%";
    return object;
}

export { changeThumb };