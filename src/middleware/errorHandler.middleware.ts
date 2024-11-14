import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../utils/error.utils';


// MiddleWare function for handling errors
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let message: string = "";
    let errors: Array<string> = [];
    let error = { ...err };

  // process errors array
  if (err.errors)
    errors = Object.values(err.errors).map((item: any) => {
      let result: any;
      if (item.properties) {
        result = item.properties.message;
      } else {
        result = item;
      }
      return result;
    });

    // Mongoose bad ObjectID
  if (err.name === "CastError") {
    message = "Resources not found - id cannot be casted";
    error = new ErrorResponse(message, 500, errors);
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    message = "Duplicate field value entered";
    error = new ErrorResponse(message, 500, errors);
  }

  //  Mongoose Validation Error
  if (err.name === "ValidationError") {
    message = "An error occured";
    error = new ErrorResponse(message, 500, errors);
  }

  // Mongose Reference Error
  if (err.name === "ReferenceError") {
    message = "Something is not right - check reference";
    error = new ErrorResponse(message, 500, errors);
  }

  res.status(error.statusCode || 500).json({
    error: true,
    errors: error.errors ? error.errors : [],
    data: error.data ? error.data : {},
    message: error.message ? error.message : "server Error",
    status: error.status ? error.status : 500,
  });

};

export default errorHandler;