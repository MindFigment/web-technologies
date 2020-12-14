function isProperName (name) {
    let re = /^[a-z\s.']+$/i;
    return re.test(name);
};

export { isProperName };
