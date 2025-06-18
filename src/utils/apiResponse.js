class apiResponse {
    constructor(statusCode, message = "Success", data,success) {
      this.statusCode = statusCode;
      this.message = message;
      this.data = data;
      this.success = success;
    }
  }
  
module.exports = {
  apiResponse
}