import {
  ERideStatusHistory,
  MAX_PAGE_SIZE,
  TCreateUserRide,
  TRelation,
  TRide,
  TRideReadResponse,
  TUser,
  TUserRidesReadResponse,
  TRidesReadResponse,
} from "../definitions";
import neo4j from "neo4j-driver";
import { driver } from "../index";

export class DbRidesController {
  private session = driver.session();

  public async getAllRides(pagenumber: number, query?: string): Promise<TRide[]> {
    const _session = driver.session();
    try {
      let respRead;
      if (query) {
        respRead = await _session.readTransaction((txc) =>
          txc.run(
            "MATCH (r:RIDE) where apoc.text.sorensenDiceSimilarity(r.title, $title) >= 0.3" +
              " RETURN r ORDER by r.id SKIP $pagination LIMIT $pageSize",
            {
              pagination: neo4j.int((pagenumber - 1) * MAX_PAGE_SIZE),
              pageSize: neo4j.int(MAX_PAGE_SIZE),
              title: query,
            }
          )
        );
      } else {
        respRead = await _session.readTransaction((txc) =>
          txc.run("MATCH (r:RIDE) RETURN r ORDER by r.id SKIP $pagination LIMIT $pageSize", {
            pagination: neo4j.int((pagenumber - 1) * MAX_PAGE_SIZE),
            pageSize: neo4j.int(MAX_PAGE_SIZE),
          })
        );
      }

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

  public async getAllRidesCount(query?: string): Promise<number> {
    const _session = driver.session();

    let respRead;
    if (query) {
      respRead = await _session.readTransaction((tcx) =>
        tcx.run("MATCH (r: RIDE) where apoc.text.sorensenDiceSimilarity(r.title, $title) >= 0.3 RETURN count(r)", {
          title: query,
        })
      );
    } else {
      respRead = await _session.readTransaction((tcx) => tcx.run("MATCH (r: RIDE) RETURN count(r)"));
    }

    try {
      const res = respRead.records.map((record) => record["_fields"][0]);
      _session.close();
      return res[0];
    } catch (error) {
      console.error(error);
      _session.close();
      return 0;
    }
  }

  public async acceptInvitation(rideId: string, userId: string): Promise<boolean> {
    const _session = driver.session();
    try {
      const response = await _session.run(
        "MATCH (u: USER {id:$userId})-[edge:RELATES]-(r: RIDE {id: $rideId}) " +
          "set edge.isSure = $isSure " +
          "set r.statusHistory=$accepted + r.statusHistory return edge;",
        {
          userId,
          rideId,
          isSure: true,
          accepted: [`ACCEPTED_BY_${userId}:${Date.now()}`],
        }
      );
      console.log(response);
      _session.close();

      return true;
    } catch (error) {
      console.error(error);

      _session.close();

      return false;
    }
  }

  public async sendInvitationToRide(rideId: string, userId: string): Promise<boolean> {
    try {
      const response = await this.session.run(
        "match (u: USER {id: $userId})  " +
          "match (r: RIDE {id: $rideId})" +
          "set r.statusHistory=$invited + r.statusHistory " +
          "create (u)-[:RELATES {isDriver: false, isFuture: true, isSure: false}]->(r)  return u",
        {
          userId,
          rideId,
          invited: [`INVITED_USER${userId}:${Date.now()}`],
        }
      );

      return true;
    } catch (error) {
      console.log(error);

      return false;
    }
  }

  public async getUserInvitations(username: string, pagination: number): Promise<TUserRidesReadResponse[]> {
    const _session = driver.session();
    try {
      const response = await _session.run(
        "match (u: USER {username: $username}) -[edge:RELATES {isSure: $isSure}] - (r: RIDE) return  r, edge " +
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

      _session.close();

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
        "match (u: USER {username: $username}) -[edge:RELATES " +
          "{isFuture:$isFuture, isSure:$isSure}] - (r: RIDE) return  r, edge " +
          "ORDER BY r.id SKIP toInteger($pagination) LIMIT toInteger($pageSize)",
        {
          username,
          pagination: pagination === 0 ? 0 : neo4j.int((pagination - 1) * MAX_PAGE_SIZE),
          pageSize: pagination === 0 ? 1000 : neo4j.int(MAX_PAGE_SIZE),
          isFuture: true,
          isSure: true,
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

      console.log(res);

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

  /*public async getUserProposedRidesCount(username: string): Promise<number> {
    const _session = driver.session();
    try {
      const response = await _session.run(
          "match (u: USER {username: $username}) -[edge:RELATES {isDriver: $isDriver, isFuture: $isFuture, " +
          "isSure: $isSure}] - (r: RIDE) return  count(r), edge ",
          {
            isDriver: false,
            isFuture: false,
            isSure: false,
            username,
          }
      );

      const res = response.records.map((record) => record["_fields"][0]);

      _session.close();
      return res[0];
    } catch (error) {
      console.error(error);
      _session.close();
      return 0;
    }
  }*/



  public async getUserProposedRides(username: string, pagination: number): Promise<TRidesReadResponse[]> {
    const _session = driver.session();
    try {
      const response = await _session.run(
          "match (u: USER {username: $username}), (r: RIDE) WHERE NOT (u)-[]-(r) return  r " +
          "ORDER BY r.id SKIP $pagination LIMIT $pageSize",
          {
            username,
            pagination: neo4j.int((pagination - 1) * MAX_PAGE_SIZE),
            pageSize: neo4j.int(MAX_PAGE_SIZE),
          }
      );

      //const res = response.records.map((record) => (record["_fields"][0].properties));
      const res = response.records.map((record) => ({
        ride: record["_fields"][0].properties as TRide,
        count: response.records.length,
      }));
      /*const res = response.records.map((record) => ({
        ride: record["_fields"][0].properties as TRide,
        relation: record["_fields"][1].properties as TRelation,
        count: response.records.length,
      }));*/

      _session.close();
      return res;
    } catch (error) {
      console.error(error);
      _session.close();
      return [];
    }
  }
}


