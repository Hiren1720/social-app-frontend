
export const getLocalStorageData = (key) => {
   return JSON.parse(localStorage.getItem(key));
};
export const setLocalStorageData = (key,data) => {
    localStorage.setItem(key, JSON.stringify(data));

}

export const removeLocalStorageData = (key) => {
    localStorage.removeItem(key);
};


