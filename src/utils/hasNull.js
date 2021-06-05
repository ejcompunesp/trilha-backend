module.exports = {
  hasNull: (body, keys) => {
    for (const key of keys) {
      if (!body[key] || body[key] === undefined || body[key] === null)
        return true;
    }

    return false;
  }
}