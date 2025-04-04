import { Sequelize,DataTypes } from "sequelize";
import {sequelize} from "./db.js";

export const Sala  = sequelize.define('Sala',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true

    },
    sala:{
        type:DataTypes.STRING,
        allowNull:false
    },
    status:{
        type:DataTypes.STRING,
        allowNull:false
    }
})

Sala.sync();