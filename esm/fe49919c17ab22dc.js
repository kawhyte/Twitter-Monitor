_17a‍.x([["default",()=>_17a‍.o]]);const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')




const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({ twitter: [], user: {}, count: 0 })
  .write();

  // Add a post
// db.get('posts')
// .push({ id: 1, title: 'lowdb is awesome'})
// .write()



_17a‍.d(db);