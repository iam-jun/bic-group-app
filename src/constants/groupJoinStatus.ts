const GROUP_JOIN_STATUS = {
  unableToJoin: 0, // users are unable to join the group
  visitor: 1, // users have not joined the group yet
  member: 2, // users have joined the group
  requested: 3, // users have requested to join
}

export default GROUP_JOIN_STATUS;
