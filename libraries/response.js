class Response {
    constructor(status, type, message, status_code) {
        this.status = status;
        this.type = type;
        this.message = message;
        this.status_code = status_code;
    }
}

module.exports = Response;
