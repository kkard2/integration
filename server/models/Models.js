import { DataTypes } from "sequelize"
import sequelize from "../db.js"

const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

const Role = sequelize.define('Role', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
})

const Summary = sequelize.define('Summary', {
    countryCode: {
        type: DataTypes.STRING,
        allowNull: false
    },
    startYear: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    endYear: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

const Comment = sequelize.define('Comment', {
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    }
})


Role.hasMany(User)

User.belongsTo(Role, {
    foreignKey: {
        allowNull: false
    }
})

User.hasMany(Summary)

Summary.belongsTo(User, {
    foreignKey: {
        allowNull: false
    }
})

Summary.hasMany(Comment)

Comment.belongsTo(Summary, {
    foreignKey: {
        allowNull: false
    }
})

export { User, Role, Summary, Comment }
