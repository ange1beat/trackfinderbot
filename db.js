const {Sequelize} = require('sequelize')

module.exports = new Sequelize(
    'chatId',
    'root',
    'root',
    {
        host: '92.53.87.108',
        port: '6432',
        dialect: 'postgres'
    }
)