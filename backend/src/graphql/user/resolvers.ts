import type { CreateUserPayload } from "../../services/user.js";
import UserService from "../../services/user.js";

const queries = {
    getUserToken : async(_: unknown, payload: {email:string, password: string}) =>{
        const token = await UserService.getUserToken({
            email: payload.email,
            password: payload.password
        })
        return token;
    },
    getCurrentLoggedInUser: async (_:unknown, params: unknown, context: any )=>{
        if(context && context.user) return context.user;
        throw new Error("No context ")
    }
};

const mutations = {
    createUser: async(_ :any, payload:CreateUserPayload) => {
        const res = await UserService.createUser(payload)
        return res.id;
    }
};

export const resolvers = {queries, mutations}