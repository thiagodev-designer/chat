import { Sequelize,DataTypes } from "sequelize";
import {sequelize} from "./db.js";

export const Msg  = sequelize.define('menssagens',{
    id:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true

    },
    sala:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    form:{
        type:DataTypes.INTEGER,
        allowNull:true,
    },
    to:{
        type:DataTypes.INTEGER,
        allowNull:true,
    },
    text:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    status:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    data:{
        type:DataTypes.DATE,
        allowNull:true,
    },
    hora:{
        type:DataTypes.INTEGER,
        allowNull:true,
    },
    read:{
        type:DataTypes.STRING,
        allowNull:true, 
    }
})

Msg.sync();