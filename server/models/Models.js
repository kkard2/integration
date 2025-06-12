import { DataTypes } from "sequelize"
import sequelize from "../db.js"
import jwt from "jsonwebtoken"

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

const generateAuthToken = (user) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY,
        { expiresIn: "7d" })
    return token
}

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

export { User, Role, Summary, Comment, generateAuthToken }
