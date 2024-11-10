import { BadRequestError, UnauthenticatedError } from "../errors/customError.js"
import { verifyJWT } from "../utils/tokenUtils.js"

export const authenticateUser = (req,res,next) => {
    const { token } = req?.cookies
    console.log(token,req?.cookies)
    if(!token) throw new UnauthenticatedError("authentication invalid")
    try {
        const { userId, role } = verifyJWT(token)
        const testUser = userId === '672efb9cc25f180da015d310';
        req.user = { userId, role, testUser };
        next();
    }
    catch(error) {
        throw new UnauthenticatedError("authentication invalid")
    }
}

export const checkForTestUser = (req, res, next) => {
    if (req.user.testUser) {
      throw new BadRequestError('Demo User. Read Only!');
    }
    next();
};

export const authorizePermissions = (...roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        throw new UnauthorizedError('Unauthorized to access this route');
      }
      next();
    };
};