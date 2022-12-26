import { MAX_PAGE_SIZE, TCreateUser, TLoginUser, TLogoutUser, TUser, TUserReadResponse } from "../definitions";
import { driver } from "../index";
import neo4j from "neo4j-driver";

export class DbUserController {
  private session = driver.session();

  public async getUserByUsername(username: string): Promise<TUserReadResponse> {
    try {
      const respRead = await this.session.run("MATCH(u : USER {username: $username }) RETURN u", { username });
      const res = respRead.records.map((record) => record["_fields"][0].properties);
      return { user: res[0] };
    } catch (error) {
      return {
        error: {
          errorMessage: JSON.stringify(error),
        },
      };
    }
  }

  public async getAllUsers(pagenumber: number): Promise<TUser[]> {
    const _session = driver.session();
    try {
      const respRead = await _session.readTransaction((tcx) =>
        tcx.run("MATCH (u:USER) RETURN u ORDER by u.id SKIP $pagination LIMIT $pageSize", {
          pagination: neo4j.int((pagenumber - 1) * MAX_PAGE_SIZE),
          pageSize: neo4j.int(MAX_PAGE_SIZE),
        })
      );
      const res = respRead.records.map((record) => record["_fields"][0].properties);
      _session.close();

      return res as TUser[];
    } catch (error) {
      console.error(error);
      _session.close();

      return [];
    }
  }

  public async getAllUsersCount(): Promise<number> {
    try {
      const respRead = await this.session.readTransaction((tcx) => tcx.run("MATCH (u: USER) RETURN count(u)"));
      const res = respRead.records.map((record) => record["_fields"][0]);
      return res[0];
    } catch (error) {
      console.error(error);
      return 0;
    }
  }

  public async loginUser(input: TLoginUser): Promise<Partial<TUser>> {
    try {
      const respRead = await this.session.run(
        "MATCH(u : USER {username: $username, password: $password }) SET u.isAuthorized = $authorized RETURN u",
        {
          username: input.username.toString(),
          password: input.password.toString(),
          authorized: true,
        }
      );
      const res = respRead.records.map((record) => record["_fields"][0].properties);
      if (!res[0]) {
        return {
          id: "",
          username: "",
          isAuthorized: false,
          isAdmin: false,
        };
      }
      return res[0];
    } catch (e) {
      console.error(e);
      return {};
    }
  }

  public async logoutUser(input: TLogoutUser): Promise<boolean> {
    try {
      const respRead = await this.session.run(
        "MATCH(u : USER {username: $username}) SET u.isAuthorized = $authorized RETURN u",
        {
          username: input.username.toString(),
          authorized: false,
        }
      );
      return !!respRead;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  public async createUser(userInput: TCreateUser): Promise<TUserReadResponse> {
    try {
      const user = {
        id: Date.now().toString(),
        username: userInput.username,
        password: userInput.password,
        isAuthorized: false,
        isAdmin: false,
      };
      await this.session.run(
        "CREATE (a:USER {id: randomUUID(), username: $username, password: $password, isAuthorized: $isAuthorized, " +
          "isAdmin: $isAdmin }) RETURN a",
        { ...user }
      );

      return { user };
    } catch (error) {
      return {
        error: {
          errorMessage: JSON.stringify(error),
        },
      };
    }
  }
}
