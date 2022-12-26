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

export type TTableDataReadCount = {
  count: number;
};

export type TAllUsersReadResponse = {
  users: TUser[];
} & TTableDataReadCount;

export type TCreateUser = Omit<TUser, "id">;
export type TLoginUser = Omit<TUser, "id">;
export type TLogoutUser = Pick<TUser, "username">;

export type TRide = {
  date: string;
  from: string;
  to: string;
  title: string;
  price: number;
  statusHistory: string[];
  maxPassengers: number;
};

export type TRelation = {
  isDriver: boolean;
  isFuture: boolean;
  isSure: boolean;
};

export type TRideReadResponse = {
  ride: TRide;
  relation: TRelation;
};

export type TUserRidesReadResponse = TRideReadResponse & {
  count: number;
};

export enum ERideStatusHistory {
  CREATED = "CREATED",
}

export type TCreateUserRide = Omit<TRide, "id" | "statusHistory"> & { username: string };

export const MAX_PAGE_SIZE = 5;
