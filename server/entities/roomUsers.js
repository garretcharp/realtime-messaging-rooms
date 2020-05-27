module.exports = class RoomUser {
  constructor ({ roomid, userid, invitedBy, createdAt = new Date() }) {
    this.roomid = roomid
    this.userid = userid
    this.invitedBy = invitedBy
    this.createdAt = createdAt.getTime()
  }

  key () {
    return {
      PK: `USER#${this.userid}`,
      SK: `ROOM#${this.roomid}`
    }
  }

  toItem () {
    return {
      ...this.key(),
      data: {
        invitedBy: this.invitedBy,
        createdAt: this.createdAt
      }
    }
  }

  static toObject (Item) {
    if (!Item || !Item.data)
      throw new Error('Invalid or Malformed RoomUser Item')

    return {
      ...Item.data,
      id: Item.PK.replace('ROOM#', ''),
      type: 'ROOM_USER'
    }
  }
}
