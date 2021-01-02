//设置存储数据
export const setStore = (name, content) => {
    if (!name) return;
    //如果不是一个字符串，转成字符串
    if (typeof content !== 'string') {
        content = JSON.stringify(content);
    }
    window.localStorage.setItem(name, content);
}

//获取存储数据
export const getStore = name => {
    if (!name) return;
    return window.localStorage.getItem(name);
}

//移除存储数据
export const removeStore = name => {
    if (!name) return;
    window.localStorage.removeItem(name);
}