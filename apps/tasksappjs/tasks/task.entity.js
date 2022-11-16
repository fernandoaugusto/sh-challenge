
module.exports = (sequelize, DataTypes, UUIDV4) => {

    const Task = sequelize.define('tasks', {
        id: {
            type: DataTypes.UUID,
            defaultValue: UUIDV4,
            primaryKey: true
        },
        title: {
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
        summary: {
            type: DataTypes.STRING(2500),
            allowNull: false,
            validate: {
                min: {
                    args: 1,
                },
                max: {
                    args: 2500,
                }
            }
        },
        is_finished: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        user_id: {
            type: DataTypes.UUID,
            allowNull: false
        },
    }, {
        createdAt: "created_date",
        updatedAt: "updated_date"
    });

    return Task;
};