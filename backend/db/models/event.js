'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Event.hasMany(models.EventImage,{
        foreignKey:'eventId',
        onDelete:'CASCADE',
        hooks:true,
      })
      Event.belongsToMany(models.User,{
        through:models.Attendance,
        foreignKey:'eventId',
        otherKey:'userId'

      })
    }
  }
  Event.init({

    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    type: DataTypes.ENUM,
    capacity: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    venueId:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
    groupId:{
      type:DataTypes.INTEGER,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
