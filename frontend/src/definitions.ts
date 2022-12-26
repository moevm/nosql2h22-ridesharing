export type TUser = {
  id: string;
  username: string;
  isAuthorized: boolean;
  isAdmin: boolean;
};

export type TCreateUser = Omit<TUser, "id">;

export enum ERideStatusHistory {
  CREATED = "CREATED",
}

export type TRideWithRelation = TRide & TRelation;

export type TRide = {
  id: string;
  date: string;
  from: string;
  to: string;
  title: string;
  price: number;
  statusHistory?: ERideStatusHistory[];
  maxPassengers: number;
};

export type TRelation = {
  isDriver: boolean;
  isFuture: boolean;
  isSure: boolean;
};

export const MAX_PAGE_SIZE = 5;
