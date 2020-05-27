module.exports = class Room {
  constructor ({ id, createdBy, isPublic = false, createdAt = new Date() }) {
    this.id = id
    this.createdBy = createdBy
    this.createdAt = createdAt.getTime()
  }

  key () {
    return {
      PK: `ROOM#${this.id}`,
      SK: `ROOM#${this.id}`
    }
  }

  gsi1Key () {
    if (isPublic !== true) return {}

    return {
      GSI1PK: `PUBLIC#ROOMS`,
      GSI1SK: `${this.id}`
    }
  }

  toItem () {
    return {
      ...this.key(),
      ...this.gsi1Key(),
      data: {
        createdBy: this.createdBy,
        createdAt: this.createdAt
      }
    }
  }

  static toObject (Item) {
    if (!Item || !Item.data) throw new Error('Invalid or Malformed Room Item')

    return {
      ...Item.data,
      id: Item.PK.replace('ROOM#', ''),
      type: 'ROOM'
    }
  }
}
