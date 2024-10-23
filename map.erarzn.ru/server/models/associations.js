const User = require('./User');
const TrashPoint = require('./TrashPoint');

User.hasMany(TrashPoint, { foreignKey: 'user_id' });
TrashPoint.belongsTo(User, { foreignKey: 'user_id' });
