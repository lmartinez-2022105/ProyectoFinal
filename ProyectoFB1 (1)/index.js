import { connect } from './configs/mongo.js'
import { InitServer } from './configs/app.js'
import { userDefault, categoryDefault } from './src/utils/defaultMethods.js'

//Datos del usuario default 
/* username: "josejose",
   mail: "josejose@gmail.com",
   password: "abcd1234",
*/

//Levantar Server
categoryDefault()
userDefault()
InitServer()
connect()