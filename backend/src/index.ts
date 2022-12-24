import express from "express";
import neo4j from "neo4j-driver";
import dotenv from "dotenv";
import cors from "cors";
import { graphqlHTTP } from "express-graphql";
import { schema } from "./graphql-schema";
import { TCreateUser, TCreateUserRide, TLoginUser, TLogoutUser } from "./definitions";
import { DbUserController } from "./db/dbUserController";
import { DbRidesController } from "./db/dbRidesController";

dotenv.config();

console.log(process.env.NEO4J_URI);
console.log(process.env.NEO4J_USER);
console.log(process.env.NEO4J_PASSWORD);

export const driver = neo4j.driver(
  process.env.NEO4J_URI || "bolt://localhost:7687",
  neo4j.auth.basic(process.env.NEO4J_USER || "neo4j", process.env.NEO4J_PASSWORD || "neo4j"),
  { disableLosslessIntegers: true }
);

const dbUserController = new DbUserController();
const dbRidesController = new DbRidesController();

const root = {
  getAllUsers: async ({ pagenumber }: { pagenumber: number }) => {
    return await dbUserController.getAllUsers(pagenumber);
  },
  getAllRides: async ({ pagenumber }: { pagenumber: number }) => {
    return await dbRidesController.getAllRides(pagenumber);
  },
  getUser: async ({ username }: { username: string }) => {
    const res = await dbUserController.getUserByUsername(username);
    console.log(res);
    // @ts-ignore
    return res[0];
  },
  logoutUser: async ({ input }: { input: TLogoutUser }) => {
    return await dbUserController.logoutUser(input);
  },
  loginUser: async ({ input }: { input: TLoginUser }) => {
    return await dbUserController.loginUser(input);
  },
  createRide: async ({ input }: { input: TCreateUserRide }) => {
    return await dbRidesController.createUserRide(input);
  },
  getUserRides: async ({ username, pagenumber }: { username: string; pagenumber: number }) => {
    return await dbRidesController.getUserRides(username, pagenumber);
  },
  createUser: async ({ input }: { input: TCreateUser }) => {
    const readUser = await dbUserController.getUserByUsername(input.username);

    if (readUser.user) {
      return {
        error: {
          errorMessage: "User with such username already registered",
        },
      };
    } else if (readUser.error) {
      return {
        error: readUser.error,
      };
    }

    return await dbUserController.createUser(input);
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
