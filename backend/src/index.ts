import express from "express";
import neo4j from "neo4j-driver";
import dotenv from "dotenv";
import cors from "cors";
import { graphqlHTTP } from "express-graphql";
import { schema } from "./graphql-schema";
import { TCreateUser } from "./definitions";

dotenv.config();

console.log(process.env.NEO4J_URI);
console.log(process.env.NEO4J_USER);
console.log(process.env.NEO4J_PASSWORD);

const driver = neo4j.driver(
  process.env.NEO4J_URI || "bolt://localhost:7687",
  neo4j.auth.basic(process.env.NEO4J_USER || "neo4j", process.env.NEO4J_PASSWORD || "neo4j")
);
const session = driver.session();

const root = {
  getAllUsers: async () => {
    const respRead = await session.run("MATCH (n:User) RETURN n, labels(n) as l LIMIT 10");
    const res = respRead.records.map((record) => record["_fields"][0].properties);
    // @ts-ignore
    return res;
  },
  getUser: async ({ id }: { id: string }) => {
    const respRead = await session.run("MATCH(u : User {id: $id }) RETURN u", { id });
    const res = respRead.records.map((record) => record["_fields"][0].properties);
    console.log(res);
    // @ts-ignore
    return res[0];
  },
  createUser: async ({ input }: { input: TCreateUser }) => {
    const id = Date.now().toString();
    const user = {
      id,
      username: input.username,
      password: input.password,
    };
    await session.run("CREATE (a:User {id: $id, username: $username, password: $password  }) RETURN a", { ...user });
    return user;
  },
};

const app = express();

app.listen(5001, async () => {
  const servInfo = await driver.getServerInfo();
  console.log(servInfo);
  console.log("server started at port 5001");
});

app.use(cors());

app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema,
    rootValue: root,
  })
);
