import { Sequelize,DataTypes } from "sequelize";
import {sequelize} from "./db.js";

export const Att  = sequelize.define('Atendimento',{
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
        allowNull:true
    },
    nome:{
        type:DataTypes.STRING,
        allowNull:false
    },
    atendente:{
        type:DataTypes.STRING,
        allowNull:true
    },
    gtdmsg:{
        type:DataTypes.INTEGER,
        allowNull:true
    }
})

Att.sync();


//campo obrigatorio sala nome