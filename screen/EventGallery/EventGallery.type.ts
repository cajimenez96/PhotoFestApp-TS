export interface Media {
  _id: string;
  EventID: string;
  MediaURL: string;
  UserID: User;
  Width: string;
  height: string;
  MediaTypeID: MediaType;
  index: number
  IsPublished: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface User {
  _id: string;
  UserName: string;
  Name: string;
  LastName: string;
  RoleID: string;
  FirstLogin: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface MediaType {
  _id: string;
  Name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
