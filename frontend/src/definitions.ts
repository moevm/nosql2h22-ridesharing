export type TUser = {
  id: string;
  username: string;
  isAuthorized: boolean;
};

export type TCreateUser = Omit<TUser, "id">;

export type TRide = {};
