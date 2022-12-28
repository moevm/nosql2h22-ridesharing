import { driver } from "../index";
import { ERideStatusHistory } from "../definitions";

export class DbGeneralController {
  private session = driver.session();

  public async downloadDB() {
    try {
      const response = await this.session.run(
        "CALL apoc.export.json.all(null,{useTypes:true, stream:TRUE, writeNodeProperties: TRUE})"
      );

      const json = JSON.stringify(response);

      return json;
    } catch (error) {
      console.log(error);
      return "";
    }
  }

  public async initDb() {
    try {
      await this.session.run(
        'MERGE (u:USER {password:"admin",isAuthorized:false,' + 'id:randomUUID(),isAdmin:true, username:"admin"});'
      );

      await this.session.run(
        'MERGE (u:USER {password:"test",isAuthorized:false,' + 'id:randomUUID(),isAdmin:false,  username:"test"});'
      );

      await this.session.run(
        'MERGE (u:USER {password:"test1",isAuthorized:false,' + 'id:randomUUID(),isAdmin:false,  username:"test1"});'
      );

      await this.session.run(
        'MERGE (u:USER {password:"test2",isAuthorized:false,' + 'id:randomUUID(),isAdmin:false,  username:"test2"});'
      );

      await this.session.run(
        'MERGE (u:USER {password:"test3",isAuthorized:false,' + 'id:randomUUID(),isAdmin:false,  username:"test3"});'
      );

      await this.session.run(
        'MERGE (u:USER {password:"test4",isAuthorized:false,' + 'id:randomUUID(),isAdmin:false,  username:"test4"});'
      );

      const response = await this.session.run(
        "MATCH (u: USER {username: $username}) CREATE (u)-[r: RELATES {isDriver: $isDriver, " +
          "isFuture: $isFuture, isSure: $isSure}]->" +
          " (:RIDE { id: randomUUID(), date: $date, from: $from, to: $to, title: $title, " +
          "price: $price, statusHistory: $statusHistory, maxPassengers: $maxPassengers });",
        {
          username: "test",
          date: "2022-12-28T14:46:48.043Z",
          from: "one",
          to: "two",
          title: "generated ride",
          price: 500,
          maxPassengers: 5,
          statusHistory: [`${ERideStatusHistory.CREATED}:${Date.now()}`],
          isDriver: true,
          isFuture: true,
          isSure: true,
        }
      );
    } catch (error) {
      console.error(error);
    }
  }
}
