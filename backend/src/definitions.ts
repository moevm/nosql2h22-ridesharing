export type TUser = {
  id: string;
  username: string;
  password: string;
  isAuthorized: boolean;
  isAdmin: boolean;
  rides?: TRide[];
};

export type TReadError = {
  errorCode?: string;
  errorMessage: string;
};

export type TUserReadResponse = {
  user?: TUser;
  error?: TReadError;
};

export type TCreateUser = Omit<TUser, "id">;
export type TLoginUser = Omit<TUser, "id">;
export type TLogoutUser = Pick<TUser, "username">;

export type TRide = {};
