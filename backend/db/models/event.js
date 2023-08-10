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
    type: DataTypes.ENUM('Online', 'In person'),
    capacity: DataTypes.INTEGER,
    price: DataTypes.DECIMAL,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    venueId:{
      type:DataTypes.INTEGER,

    },
    groupId:{
      type:DataTypes.INTEGER,

    }
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
