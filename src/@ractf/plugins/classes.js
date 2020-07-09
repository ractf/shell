const classMap = {};

export const getClass = (baseClass) => {
    let key = baseClass;
    while (classMap[key]) key = classMap[key];
    return key;
};
export const registerSubclass = (baseClass, subClass) => {
    classMap[baseClass] = subClass;
};
