import { Sequelize,DataTypes } from "sequelize";
import {sequelize} from "./db.js";

export const Av  = sequelize.define('Avaliacao',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    nota:{
        type:DataTypes.STRING,
        allowNull:false
    }
})

Av.sync();