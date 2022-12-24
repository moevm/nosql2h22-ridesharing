export type TUser = {
  id: string;
  username: string;
  isAuthorized: boolean;
  isAdmin: boolean;
};

export type TCreateUser = Omit<TUser, "id">;

export type TRide = {};
