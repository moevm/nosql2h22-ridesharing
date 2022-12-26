import { driver } from "../index";

export class DbGeneralController {
  private session = driver.session();

  public async downloadDB() {
    try {
      const response = await this.session.run("CALL apoc.export.json.all(null,{useTypes:true, stream:TRUE})");

      const json = response.records.map((entry) => JSON.stringify(entry));

      return json;
    } catch (error) {
      console.log(error);
      return "";
    }
  }
}
