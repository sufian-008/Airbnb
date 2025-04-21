class ExpressError extends Error {
    constructor(satusCode, message){
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = ExpressError;