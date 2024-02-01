//Middleware
//Ensure user is logged in BEFORE giving access to routes
//IF, NOT ---> Send user Error Message
function requireUser(req, res, next) {
    if(!req.user) {
        res.status(401).json({
            error: {
                name: "MissingUserError",
                message: "You must be logged in to preform this action",
            }, 
        });
    } else {
        next();
    }  
}

//Middleware to check if a user is an admin
 function requireAdmin(res, res, next) {
    if(!req.user || req.user.role !== "admin") {
        res.status(401).json({
            error: {
                name: "UnauthorizedError",
            message: "You must be an admin to prefrom this action",
        },
    });
        } else {
            next();
        }
    }
 
module.exports = { requireUser, requireAdmin };