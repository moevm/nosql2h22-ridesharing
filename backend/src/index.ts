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
  getAllUsersCount: async () => {
    return await dbUserController.getAllUsersCount();
  },
  getAllRides: async ({ pagenumber }: { pagenumber: number }) => {
    return await dbRidesController.getAllRides(pagenumber);
  },
  getAllRidesCount: async () => {
    return await dbRidesController.getAllRidesCount();
  },
  getUser: async ({ username }: { username: string }) => {
    const res = await dbUserController.getUserByUsername(username);
    // @ts-ignore
    return res[0];
  },
  getAllUsersInRide: async ({ id }: { id: string }) => {
    return await dbRidesController.getAllUsersInRide(id);
  },
  deleteRide: async ({ input }: { input: { id: string } }) => {
    return dbRidesController.deleteRide(input.id);
  },
  markRideAsResolved: async ({ input }: { input: { id: string } }) => {
    return dbRidesController.markRideAsResolved(input.id);
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
  getRide: async ({ id, username }: { id: string; username: string }) => {
    return await dbRidesController.getRide(id, username);
  },
  getUserRides: async ({ username, pagenumber }: { username: string; pagenumber: number }) => {
    return await dbRidesController.getUserRides(username, pagenumber);
  },
  getUserPassedRides: async ({ username, pagenumber }: { username: string; pagenumber: number }) => {
    return await dbRidesController.getUserPassedRides(username, pagenumber);
  },
  getUserInvitations: async ({ username, pagenumber }: { username: string; pagenumber: number }) => {
    return await dbRidesController.getUserInvitations(username, pagenumber);
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
