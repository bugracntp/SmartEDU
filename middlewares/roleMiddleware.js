module.exports = (roles) => {
    return (req, res, next) => {
        const userRole = req.body.role;
        if (roles.includes(userRole)) next();
        else
            return res
                .status(401)
                .send("You don't have permision for this action.");
    };
};
