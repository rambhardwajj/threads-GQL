import express from "express"
import {ApolloServer} from "@apollo/server"
import {expressMiddleware} from "@as-integrations/express5"
import { prisma } from "./lib/db.js";


async function main() {
    const app = express();
    app.use(express.json());
    const PORT = Number(process.env.PORT) || 8000
    const gqlServer = new ApolloServer({
        typeDefs : `
            type Query{
                hello : String
                say(name: String) : String
            }
            type Mutation{
                createUser(name:String!, email:String!, password:String! ): Boolean
            }
        `,   
        resolvers : {
            Query : {
                hello : () => `Hey Helloww1`,
                say: (_ : unknown, {name}: {name: String}  ) =>  `Hey ${name}, How are you `
            },
            Mutation:{
                createUser: async (_: unknown, {name, email, password}: {name:string, email: string, password:string})=>{
                    await prisma.user.create({
                        data:{
                            name, email,password, salt:"random"
                        }
                    })
                    return true;
                }
            }
        }  // 
    })
    await gqlServer.start();
    app.get('/', (req, res) =>{
        res.status(200).json({message:' I am running fast '})
    })  
    app.use('/graphql', expressMiddleware(gqlServer) )
    app.listen(PORT, () =>{
        console.log("Server is listening on port ", PORT)
    })
}

main();

