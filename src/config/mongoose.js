const mongoose = require('mongoose'); // Import mongoose library for MongoDB interaction
const logger = require('./logger'); // Import custom logger module
const { mongo, env } = require('./vars'); // Import configuration variables

// Set mongoose Promise to native JavaScript Promise
mongoose.Promise = Promise;

// Exit application on error
mongoose.connection.on('error', (err) => {
  // Log the error and exit the process if a connection error occurs
  logger.error(`MongoDB connection error: ${err}`);
  process.exit(-1);
});

// Enable mongoose debug mode in development environment
if (env === 'development') {
  mongoose.set('debug', true); // Log mongoose operations to the console
}

/**
 * Connect to MongoDB
 *
 * @returns {object} Mongoose connection
 * @public
 */
exports.connect = () => {
  mongoose
    .connect(mongo.uri, {
      useCreateIndex: true, // Use MongoDB's createIndex() instead of ensureIndex()
      keepAlive: 1, // Keep the connection alive
      useNewUrlParser: true, // Use the new MongoDB connection string parser
      useUnifiedTopology: true, // Use the new server discovery and monitoring engine
      useFindAndModify: false, // Use native findOneAndUpdate() rather than findAndModify()
    })
    .then(() => console.log('mongoDB connected...')); // Log successful connection
  return mongoose.connection; // Return the mongoose connection object
};

