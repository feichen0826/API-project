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
      Event.belongsTo(models.Venue, {
        foreignKey: 'venueId',
      });

      Event.belongsTo(models.Group, {
        foreignKey: 'groupId',
      });
    }
  }
  Event.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
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
