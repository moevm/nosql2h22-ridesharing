import { driver } from "../index";

export class DbGeneralController {
  private session = driver.session();

  public async downloadDB() {
    try {
      const response = await this.session.run("CALL apoc.export.json.all('all.json',{useTypes:true, stream:TRUE})");

      const json = response.records.map((entry) => JSON.stringify(entry));

      return json;
    } catch (error) {
      console.log(error);
      return "";
    }
  }

  public async initDb() {
    try {

      await this.session.run(
        'MERGE (u:USER {password:"admin",isAuthorized:true,' +
          'id:"850e1fec-176d-40c8-b00e-14da27fa54b2",isAdmin:true, username:"admin"});'
      );

      await this.session.run(
        'MERGE (u:USER {password:"test",isAuthorized:true,' +
          'id:"8714404c-5f3b-49a3-94f2-c41940b3e892",isAdmin:false,  username:"test"});'
      );
    } catch (error) {
      console.error(error);
    }
  }
}
