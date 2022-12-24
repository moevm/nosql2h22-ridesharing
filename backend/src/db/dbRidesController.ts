import {
  ERideStatusHistory,
  MAX_PAGE_SIZE,
  TCreateUserRide,
  TRelation,
  TRide,
  TUserRidesReadResponse,
} from "../definitions";
import neo4j from "neo4j-driver";
import { driver } from "../index";

export class DbRidesController {
  private session = driver.session();

  public async getAllRides(pagenumber: number): Promise<TRide[]> {
    try {
      const respRead = await this.session.readTransaction((txc) =>
        txc.run("MATCH (r:RIDE) RETURN r ORDER by r.id SKIP $pagination LIMIT $pageSize", {
          pagination: neo4j.int((pagenumber - 1) * MAX_PAGE_SIZE),
          pageSize: neo4j.int(MAX_PAGE_SIZE),
        })
      );
      const res = respRead.records.map((record) => record["_fields"][0].properties);
      console.log(res);
      return res as TRide[];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  public async getUserRides(username: string, pagination: number): Promise<TUserRidesReadResponse[]> {
    try {
      const response = await this.session.run(
        "match (u: USER {username: $username}) -[edge:RELATES] - (r: RIDE) return  r, edge " +
          "ORDER BY r.id SKIP $pagination LIMIT $pageSize",
        { username, pagination: neo4j.int((pagination - 1) * MAX_PAGE_SIZE), pageSize: neo4j.int(MAX_PAGE_SIZE) }
      );

      // each response is in format:
      // [
      //     Node {
      //       ...
      //       properties: [Object] -> TRide,
      //     },
      //     Relationship {
      //       ...
      //       properties: [Object] -> TRelation,
      //     }
      //   ],
      //

      const res = response.records.map((record) => ({
        ride: record["_fields"][0].properties as TRide,
        relation: record["_fields"][1].properties as TRelation,
      }));

      console.log(res);

      return res;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  public async createUserRide(createUserRideInput: TCreateUserRide): Promise<boolean> {
    try {
      console.log(createUserRideInput);

      const response = await this.session.run(
        "MATCH (u: USER {username: $username}) CREATE (u)-[r: RELATES {isDriver: $isDriver, " +
          "isFuture: $isFuture, isSure: $isSure}]->" +
          " (:RIDE { id: $id, date: $date, from: $from, to: $to, title: $title, " +
          "price: $price, statusHistory: $statusHistory, maxPassengers: $maxPassengers });",
        {
          ...createUserRideInput,
          statusHistory: [ERideStatusHistory.CREATED],
          isDriver: true,
          isFuture: true,
          isSure: true,
          id: Date.now().toString(),
        }
      );

      return true;
    } catch (e) {
      return false;
    }
  }
}
