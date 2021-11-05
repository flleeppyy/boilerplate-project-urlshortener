const Database = require("@replit/database")



module.exports = async () => {
  const db = new Database();
  if (await db.get("urls") == null) {
    await db.set("urls", [])
  }

  return db;
}