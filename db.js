const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')




const adapter = new FileSync('./public/db.json')
const db = low(adapter)

db.defaults({ twitter: [], count: 0 })
  .write();

  // Add a post
// db.get('posts')
// .push({ id: 1, title: 'lowdb is awesome'})
// .write()



export default db;