import { User } from "../@types";
import { getCouchbaseConnection } from "../db";
import APIError from "../errors/APIError";
import TokenService from './token.service'

const signUp = async (user: User) => {
    console.log("Before getting couchbase connection ")
    const { users, cluster } = await getCouchbaseConnection();
    console.log("After couchbase connection");
    const queryResult = await cluster.query("SELECT * FROM `TodoBucket`.`UserScope`.`users` WHERE email=$email OR id=$id'", {
        parameters: {
            email: user.email,
            id: user.id
        }
    })
    const duplicateUser = queryResult.rows[0]
    if (duplicateUser) {
        throw new APIError(400, "USER_ALREADY_EXISTS", "This email or id is already in use");
    }
    const newUser = users.insert(user.id, user);
    return newUser;
};

const signIn = async (user: { email: string, password: string }) => {
    const { email, password } = user;
    const dbUser = await getUserByEmail(email);
    console.log("Dbuser: " + dbUser);
    console.log("dbUser.password: " + dbUser.password + '\npassword: ' + password);


    if (dbUser.password !== password) {
        throw new APIError(403, 'INVALID_CREDENTIALS', "Email and/or password is incorrect.")
    }
    delete dbUser.password;

    const accessToken = TokenService.generateAccessToken(dbUser);
    const refreshToken = TokenService.generateRefreshToken({ id: dbUser.id });
    return {
        data: dbUser,
        accessToken,
        refreshToken
    }

}

const getUserById = async (id: string) => {
    const { users } = await getCouchbaseConnection();
    const result = await users.get(id);
    return result.content;
}

const getUserByEmail = async (email: string) => {
    const { cluster } = await getCouchbaseConnection();
    const queryResult = await cluster.query('SELECT * FROM `TodoBucket`.`UserScope`.`users` WHERE email=$email', {
        parameters: {
            email,
        }
    })
    if (queryResult.rows.length === 0) return new APIError(404, "USER_NOT_FOUND", "There is no user with this email");
    return queryResult.rows[0]['users'];
}


const refresh_token = async (refreshToken: string) => {
    const verifiedRefreshToken = TokenService.verifyRefreshToken(refreshToken);
    const verifiedUser = await getUserById(verifiedRefreshToken.id);
    delete verifiedUser.password;
    const accessToken = TokenService.generateAccessToken(verifiedUser);
    return { accessToken };
};

export const AuthService = {
    signIn,
    signUp,
    getUserById,
    getUserByEmail,
    refresh_token
}