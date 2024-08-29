const getIndexPage = (req ,res) => {
    res.send("Application Started Index")
};
const getUserPage = (req ,res) => {
    res.send("Application Started User")
};

export{getIndexPage, getUserPage};