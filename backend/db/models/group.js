'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.belongsTo(models.User,{
        foreignKey:'organizerId',
        as: 'Organizer',
      })
      Group.belongsToMany(models.Venue,{
        through:models.Event,
        foreignKey:'groupId',
        otherKey:'venueId',

      })
      Group.hasMany(models.Membership,{
        foreignKey:'groupId',
        onDelete:'CASCADE',
        hooks:true,
      })

      Group.hasMany(models.Venue,{
        foreignKey:'groupId',
        onDelete:'CASCADE',
        hooks:true,
      })
      Group.hasMany(models.GroupImage,{
        foreignKey:'groupId',
        onDelete:'CASCADE',
        hooks:true,
      })
      Group.hasMany(models.Event,{
        foreignKey:'groupId'
      })
    }
  }
  Group.init({
    name: DataTypes.STRING,
    about: DataTypes.TEXT,
    type:{
      type: DataTypes.ENUM('Online', 'In person'),
    },
    private: DataTypes.BOOLEAN,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    organizerId: {
      type:DataTypes.INTEGER,
      allowNull:false
    }
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};
