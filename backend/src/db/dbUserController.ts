import { TCreateUser, TLoginUser, TLogoutUser, TUser, TUserReadResponse } from "../definitions";
import { session } from "../index";

export class DbUserController {
  public async getUserByUsername(username: string): Promise<TUserReadResponse> {
    try {
      const respRead = await session.run("MATCH(u : USER {username: $username }) RETURN u", { username });
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

  public async getAllUsers(): Promise<TUser[]> {
    try {
      const respRead = await session.run("MATCH (n:USER) RETURN n, labels(n) as l LIMIT 10");
      const res = respRead.records.map((record) => record["_fields"][0].properties);
      return res as TUser[];
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  public async loginUser(input: TLoginUser): Promise<Partial<TUser>> {
    try {
      const respRead = await session.run(
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
      const respRead = await session.run(
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
      await session.run(
        "CREATE (a:USER {id: $id, username: $username, password: $password, isAuthorized: $isAuthorized, isAdmin: $isAdmin }) RETURN a",
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
