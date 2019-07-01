const neo4j = require('neo4j-driver').v1;
class Database {
    constructor() {
        if (Database.instance) {
            return Database.instance;
        }

        Database.instance = this;
        this.driver = {};
        return this;
    }

    connect () {
        if (Database.driver) {
            return Database.driver;
        }
        if (process.env.NODE_ENV === 'development') {
            this.driver = neo4j.driver(
                'bolt://localhost:7687',
                neo4j.auth.basic('neo4j', 'test')
            );
        } else {
            this.driver = neo4j.driver(
                process.env.NEO4J_URL,
                neo4j.auth.basic(process.env.NEO4J_USERNAME, process.env.NEO4J_PASSWORD)
            );
        }
        Database.driver = this.driver;
        return this.driver;
    }

    closeConnection() {
        if (Database.driver) {
            this.driver.close();
        }
        return true;
    }
}
module.exports = Database;
