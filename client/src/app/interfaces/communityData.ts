export interface IcommunityMemberData {
  _id: string;
  communities: communityData[];
}

interface communityData {
  _id: string;
  title: string;
  course_id: string;
}
