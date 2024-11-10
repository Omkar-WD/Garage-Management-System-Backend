const useLocalStorage = () => {
    // Get item from localStorage
    const getItem = (keyName) => {
        const storedValue = localStorage.getItem(keyName);
        return storedValue ? JSON.parse(storedValue) : null;
    };

    // Set item in localStorage
    const setItem = (keyName, value) => {
        localStorage.setItem(keyName, JSON.stringify(value));
    };

    // Clear all localStorage
    const clear = () => {
        localStorage.clear();
    };

    // Remove specific item from localStorage
    const removeItem = (keyName) => {
        localStorage.removeItem(keyName);
    };

    return {
        getItem,
        setItem,
        removeItem,
        clear
    };
};

export default useLocalStorage;
