enum GroupJoinStatus {
  UNABLE_TO_JOIN = 0, // users are unable to join the group
  VISITOR = 1, // users have not joined the group yet
  MEMBER = 2, // users have joined the group
  REQUESTED = 3, // users have requested to join
}

export default GroupJoinStatus;
