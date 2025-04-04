import { Sequelize,DataTypes } from "sequelize";
import {sequelize} from "./db.js";


export const User  = sequelize.define('usuario',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true

    },
    nome:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    usuario:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    senha:{
        type:DataTypes.STRING,
        allowNull:false,
    },
})

User.sync();
