module.exports = class User {
  constructor ({ id, name, picture, email }) {
    this.id = id
    this.name = name
    this.picture = picture
    this.email = email
  }

  key () {
    return {
      PK: `USER#${this.id}`,
      SK: `USER#${this.id}`
    }
  }

  gsi1Key () {
    return {
      GSI1PK: `EMAIL#${this.email}`,
      GSI1SK: `EMAIL#${this.email}`
    }
  }

  toItem () {
    return {
      ...this.key(),
      ...this.gsi1Key(),
      data: {
        name: this.name,
        picture: this.picture
      }
    }
  }

  static toObject (Item) {
    if (!Item || !Item.data) throw new Error('Invalid or Malformed User Item')

    return {
      ...Item.data,
      id: Item.PK.replace('USER#', ''),
      type: 'USER'
    }
  }
}
