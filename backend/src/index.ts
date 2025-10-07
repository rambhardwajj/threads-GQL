import express from "express"
import {expressMiddleware} from "@as-integrations/express5"
import { createGraphQLServer } from "./graphql/index.js";
import UserService from "./services/user.js";

async function main() {
    const app = express();
    app.use(express.json());
    const PORT = Number(process.env.PORT) || 8000
    
    app.get('/', (req, res) =>{
        res.status(200).json({message:' I am running fast '})
    })  
    const gqlServer = await createGraphQLServer();

    app.use('/graphql', expressMiddleware(gqlServer, {
        context: async ({req}) => {
            // @ts-ignore 
            const token = req.headers['token']
            if(!token) throw new Error("token not found")
            try {
                const user = await UserService.decodeToken(token as string)
                return {user}
            } catch (error) {
                return {}
            }
        }
    } ) )
    app.listen(PORT, () =>{
        console.log("Server is listening on port ", PORT)
    })
}

main();