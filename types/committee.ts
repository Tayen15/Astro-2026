export interface CommitteeMember {
  id: string;
  name: string;
  role: string;
  divisionId: string;
  divisionName: string;
  image: string;
  isLeader?: boolean;
  quote?: string;
  instagram?: string;
  linkedin?: string;
}

export interface CommitteeDivision {
  id: string;
  name: string;
  slug: string;
  shortDesc: string;
  fullDesc: string;
  leader: CommitteeMember;
  coLeader?: CommitteeMember;
  staffCount: number;
  members: CommitteeMember[];
  color: string;
}
