import {
  ERideStatusHistory,
  MAX_PAGE_SIZE,
  TCreateUserRide,
  TRelation,
  TRide,
  TRideReadResponse,
  TUser,
  TUserRidesReadResponse,
} from "../definitions";
import neo4j from "neo4j-driver";
import { driver } from "../index";

export class DbRidesController {
  private session = driver.session();

  public async getAllRides(pagenumber: number): Promise<TRide[]> {
    const _session = driver.session();
    try {
      const respRead = await _session.readTransaction((txc) =>
        txc.run("MATCH (r:RIDE) RETURN r ORDER by r.id SKIP $pagination LIMIT $pageSize", {
          pagination: neo4j.int((pagenumber - 1) * MAX_PAGE_SIZE),
          pageSize: neo4j.int(MAX_PAGE_SIZE),
        })
      );
      const res = respRead.records.map((record) => record["_fields"][0].properties);

      _session.close();

      return res as TRide[];
    } catch (error) {
      _session.close();

      console.error(error);
      return [];
    }
  }

  public async getAllUsersInRide(id: string): Promise<TUser[]> {
    const _session = driver.session();

    try {
      const response = await _session.run("MATCH (r:RIDE { id: $id } )-[:RELATES]-(u: USER) return u", {
        id,
      });

      console.log(response.records.map((record) => record["_fields"][0]));

      _session.close();

      return response.records.map((record) => record["_fields"][0].properties);
    } catch (error) {
      _session.close();

      console.error(error);
      return [];
    }
  }

  public async getRide(id: string, username: string): Promise<TRideReadResponse | void> {
    try {
      const respRead = await this.session.readTransaction((tcx) =>
        tcx.run("MATCH (u: USER {username: $username})-[edge: RELATES]-(r:RIDE {id: $id}) RETURN r, edge", {
          id,
          username: username.toString(),
        })
      );

      const res = {
        ride: respRead.records[0]["_fields"][0].properties as TRide,
        relation: respRead.records[0]["_fields"][1].properties as TRelation,
      };

      console.log(res);

      return res;
    } catch (error) {
      console.error(error);
    }
  }

  public async getAllRidesCount(): Promise<number> {
    try {
      const respRead = await this.session.readTransaction((tcx) => tcx.run("MATCH (r: RIDE) RETURN count(r)"));
      const res = respRead.records.map((record) => record["_fields"][0]);
      return res[0];
    } catch (error) {
      console.error(error);
      return 0;
    }
  }

  public async getUserInvitations(username: string, pagination: number): Promise<TUserRidesReadResponse[]> {
    try {
      const response = await this.session.run(
        "match (u: USER {username: $username}) -[edge:RELATES {isSure: isSure}] - (r: RIDE) return  r, edge " +
          "ORDER BY r.id SKIP $pagination LIMIT $pageSize",
        {
          isSure: false,
          username,
          pagination: neo4j.int((pagination - 1) * MAX_PAGE_SIZE),
          pageSize: neo4j.int(MAX_PAGE_SIZE),
        }
      );

      const res = response.records.map((record) => ({
        ride: record["_fields"][0].properties as TRide,
        relation: record["_fields"][1].properties as TRelation,
        count: response.records.length,
      }));

      console.log(res);

      return res;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  public async getUserPassedRides(username: string, pagination: number): Promise<TUserRidesReadResponse[]> {
    const _session = driver.session();
    try {
      const response = await _session.run(
        "match (u: USER {username: $username}) -[edge:RELATES {isFuture: $isFuture}] - (r: RIDE) return  r, edge " +
          "ORDER BY r.id SKIP $pagination LIMIT $pageSize",
        {
          isFuture: false,
          username,
          pagination: neo4j.int((pagination - 1) * MAX_PAGE_SIZE),
          pageSize: neo4j.int(MAX_PAGE_SIZE),
        }
      );

      const res = response.records.map((record) => ({
        ride: record["_fields"][0].properties as TRide,
        relation: record["_fields"][1].properties as TRelation,
        count: response.records.length,
      }));

      _session.close();
      return res;
    } catch (error) {
      console.error(error);
      _session.close();
      return [];
    }
  }

  public async getUserRides(username: string, pagination: number): Promise<TUserRidesReadResponse[]> {
    const _session = driver.session();

    try {
      const response = await this.session.run(
        "match (u: USER {username: $username}) -[edge:RELATES {isFuture:$isFuture}] - (r: RIDE) return  r, edge " +
          "ORDER BY r.id SKIP $pagination LIMIT $pageSize",
        {
          username,
          pagination: neo4j.int((pagination - 1) * MAX_PAGE_SIZE),
          pageSize: neo4j.int(MAX_PAGE_SIZE),
          isFuture: true,
        }
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
        count: response.records.length,
      }));

      _session.close();

      return res;
    } catch (error) {
      console.error(error);
      _session.close();
      return [];
    }
  }

  public async markRideAsResolved(rideId: string): Promise<boolean> {
    const _session = driver.session();
    try {
      const response = await _session.run(
        "MATCH (u: USER)-[edge:RELATES]-(r: RIDE {id: $id}) " +
          "set r.statusHistory=$resolved + r.statusHistory " +
          "set edge.isFuture=$isFuture;",
        {
          id: rideId,
          resolved: [`RESOLVED:${Date.now()}`],
          isFuture: false,
        }
      );
      _session.close();

      return true;
    } catch (error) {
      console.error(error);

      _session.close();

      return false;
    }
  }

  public async deleteRide(rideId: string): Promise<boolean> {
    const _session = driver.session();
    try {
      const response = await _session.run(
        "MATCH (u: USER)-[edge:RELATES]-(r: RIDE {id: $id}) " +
          "set r.statusHistory=$detached + r.statusHistory delete edge;",
        {
          id: rideId,
          detached: [`DETACHED:${Date.now()}`],
        }
      );
      _session.close();

      return true;
    } catch (error) {
      console.error(error);

      _session.close();

      return false;
    }
  }

  public async createUserRide(createUserRideInput: TCreateUserRide): Promise<boolean> {
    try {
      console.log(createUserRideInput);

      const response = await this.session.run(
        "MATCH (u: USER {username: $username}) CREATE (u)-[r: RELATES {isDriver: $isDriver, " +
          "isFuture: $isFuture, isSure: $isSure}]->" +
          " (:RIDE { id: randomUUID(), date: $date, from: $from, to: $to, title: $title, " +
          "price: $price, statusHistory: $statusHistory, maxPassengers: $maxPassengers });",
        {
          ...createUserRideInput,
          statusHistory: [`${ERideStatusHistory.CREATED}:${Date.now()}`],
          isDriver: true,
          isFuture: true,
          isSure: true,
        }
      );

      return true;
    } catch (e) {
      return false;
    }
  }
}
