import express from "express";
import neo4j from "neo4j-driver";
import dotenv from "dotenv";
import cors from "cors";
import { graphqlHTTP } from "express-graphql";
import { schema } from "./graphql-schema";
import { TCreateUser, TCreateUserRide, TLoginUser, TLogoutUser, TRideInvitationInput } from "./definitions";
import { DbUserController } from "./db/dbUserController";
import { DbRidesController } from "./db/dbRidesController";
import { DbGeneralController } from "./db/dbGeneralController";
import * as fs from "fs";

dotenv.config();

console.log(process.env.NEO4J_URI);
console.log(process.env.NEO4J_USER);
console.log(process.env.NEO4J_PASSWORD);
console.log(process.env.NEO4J_AUTH);

export const driver = neo4j.driver(
  process.env.NEO4J_URI || "bolt://neo4j:7687",
  neo4j.auth.basic(process.env.NEO4J_USER || "neo4j", process.env.NEO4J_PASSWORD || "123456789"),
  { disableLosslessIntegers: true }
);

const dbUserController = new DbUserController();
const dbRidesController = new DbRidesController();
const dbGeneralController = new DbGeneralController();

const root = {
  getAllUsers: async ({ pagenumber, query }: { pagenumber: number; query?: string }) => {
    return await dbUserController.getAllUsers(pagenumber, query);
  },
  getAllUsersCount: async ({ query }: { query?: string }) => {
    return await dbUserController.getAllUsersCount(query);
  },
  getAllRides: async ({ pagenumber, query }: { pagenumber: number; query?: string }) => {
    return await dbRidesController.getAllRides(pagenumber, query);
  },
  getAllRidesCount: async ({ query }: { query?: string }) => {
    return await dbRidesController.getAllRidesCount(query);
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
  getUserProposedRides: async ({ username, pagenumber }: { username: string; pagenumber: number }) => {
    return await dbRidesController.getUserProposedRides(username, pagenumber);
  },
  getUserInvitations: async ({ username, pagenumber }: { username: string; pagenumber: number }) => {
    return await dbRidesController.getUserInvitations(username, pagenumber);
  },
  sendRideInvitation: async ({ input }: { input: TRideInvitationInput }) => {
    return await dbRidesController.sendInvitationToRide(input.rideId, input.userId);
  },
  acceptInvitation: async ({ input }: { input: TRideInvitationInput }) => {
    return await dbRidesController.acceptInvitation(input.rideId, input.userId);
  },
  addProposedRide: async ({ input }: { input: TRideInvitationInput }) => {
    console.log("----------test-------------")
    return await dbRidesController.addProposedRide(input.rideId, input.userId);
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

app.use(cors());

app.listen(5001, async () => {
  const servInfo = await driver.getServerInfo();
  console.log(servInfo);
  console.log("server started at port 5001");

  const usersCount = await dbUserController.getAllUsersCount();
  const isDbEmpty = usersCount === 0;

  if (isDbEmpty) {
    console.info("INITIALIZING BD");
    await dbGeneralController.initDb();
  }
});

app.get("/download", async (req, res) => {
  const json = await dbGeneralController.downloadDB();

  fs.writeFileSync("./src/all.json", json.toString());

  res.sendFile("./all.json", { root: __dirname });
});

app.use(
  "/graphql",
  graphqlHTTP({
    graphiql: true,
    schema,
    rootValue: root,
  })
);
