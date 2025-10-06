import express from "express"
import {ApolloServer} from "@apollo/server"
import {expressMiddleware} from "@as-integrations/express5"


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
        `,   
        resolvers : {
            Query : {
                hello : () => `Hey Helloww1`,
                say: (_ : unknown, {name}: {name: String}  ) =>  `Hey ${name}, How are you `
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

