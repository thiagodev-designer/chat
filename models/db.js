import { Sequelize } from "sequelize";
//desenvolvimento
/*export const sequelize = new Sequelize('menssagens','root','',{
  host: 'localhost',
dialect: 'mysql'
})*/
//producao
export const sequelize = new Sequelize('sql10770076','sql10770076','VB4MKz2KJw',{
    host: 'sql10.freesqldatabase.com',
  dialect: 'mysql'
})
//export const sequelize = new Sequelize('postgresql://root:gsEjUxeOi6ysmdnGRJJvR7njmxJrzGtL@dpg-cv90qdogph6c73c444b0-a/menssagens')
sequelize.authenticate()


