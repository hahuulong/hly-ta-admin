export const saveLS = (key: string, value: unknown) => {
    localStorage.setItem(key, JSON.stringify(value));
};

export const loadLS = (key: string, def = []) => {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : def;
};
