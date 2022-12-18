export type TUser = {
  id: string;
  username: string;
  password: string;
  rides?: TRide[];
};

export type TCreateUser = Omit<TUser, "id">;

export type TRide = {};
