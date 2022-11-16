
module.exports = (sequelize, DataTypes, UUIDV4) => {

    const User = sequelize.define('users', {
        id: {
            type: DataTypes.UUID,
            defaultValue: UUIDV4,
            primaryKey: true
        },
        first_name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                min: {
                    args: 1,
                },
                max: {
                    args: 50,
                }
            }
        },
        last_name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                min: {
                    args: 1,
                },
                max: {
                    args: 50,
                }
            }
        },
        email: {
            type: DataTypes.STRING(100),
            unique: true,
            validate: {
                isEmail: true
            }
        },
        password: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                min: {
                    args: 8,
                },
                max: {
                    args: 100,
                }
            }
        },
        manager_id: {
            type: DataTypes.UUID,
            allowNull: true
        },
        type: {
            type: DataTypes.STRING(10),
            allowNull: false,
            validate: {
                isIn: {
                    args: [['MANAGER', 'TECHNICIAN']]
                }
            }
        },
    }, {
        timestamps: false,
        createdAt: false,
        updatedAt: false
    });

    return User;
};

