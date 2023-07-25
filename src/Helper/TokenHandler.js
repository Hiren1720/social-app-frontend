
export const getLocalStorageData = (key) => {
    let data = localStorage.getItem(key);
   return data !== 'undefined' ? JSON.parse(localStorage.getItem(key)) : null;
};
export const setLocalStorageData = (key,data) => {
    localStorage.setItem(key, data ? JSON.stringify(data): data || "");

}

export const removeLocalStorageData = (key) => {
    localStorage.removeItem(key);
};


