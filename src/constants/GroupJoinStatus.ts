enum GroupJoinStatus {
  UNABLE_TO_JOIN = 0, // users are unable to join the group
  VISITOR = 'CAN_JOIN', // users have not joined the group yet
  MEMBER = 'JOINED', // users have joined the group
  REQUESTED = 'WAITING', // users have requested to join
  INVITED_ONLY = 'INVITED_ONLY' // users have not joined the group yet & membership policy setting of the group = Only invited people
}

export default GroupJoinStatus;
