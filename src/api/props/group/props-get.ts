export interface Member {
  user: string;
  role: string;
  joined: boolean;
  _id: string;
}

export interface Group {
  image: string;
  _id: string;
  projectName: string;
  creator: {
    _id: string;
    username: string;
  };
  deadline: string;         // ISO date
  members: Member[];
  createdAt: string;        // ISO date
  updatedAt: string;        // ISO date
  __v: number;
}

export interface PropsGetGroup {
  valid: boolean;
  groups: Group[];
  message: string;
  hasMore?: boolean;
}
