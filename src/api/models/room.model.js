const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../errors/api-error');

const roles = ['admin', 'member'];

/**
 * Member Subdocument Schema
 */
const memberSchema = new mongoose.Schema({
  user: {

    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    enum: roles,
    default: 'member',
  },
}, { _id: false });

/**
 * Room Schema
 */
const roomSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [memberSchema],
}, {
  timestamps: true,
});

/**
 * Methods
 */
roomSchema.method({
  transform() {

    const transformed = {};

    const fields = ['id', 'name', 'ownerId', 'members', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;

  },

});


/**
 * Statics
 */
roomSchema.statics = {
  roles,

  /**
   * Get room by ID
   * @param {ObjectId} id - Room ID
   * @returns {Promise<Room, APIError>}
   */
  async get(id) {
    let room;
    if (mongoose.Types.ObjectId.isValid(id)) {
      room = await this.findById(id).populate('members.user').exec();
    }
    if (room) return room;


    throw new APIError({
      message: 'Room does not exist',
      status: httpStatus.NOT_FOUND,
    });

  },


  /**
   * Get room by name
   * @param {String} name - Room name
   * @returns {Promise<Room, APIError>}
   */
  async getByName(name) {
    const room = await this.findOne({ name }).populate('members.user').exec();
    if (room) return room;

    throw new APIError({
      message: 'Room not found',
      status: httpStatus.NOT_FOUND,

    });
  },

  /**
   * List rooms with pagination
   * @param {Object} options
   * @returns {Promise<Room[]>}
   */
  list({ page = 1, perPage = 10 }) {
    return this.find({})

      .sort({ createdAt: -1 })
      .skip(perPage * (page - 1))
      .limit(perPage)
      .exec();
  },

  /**
   * Check for duplicate room name
   */
  checkDuplicateName(error) {
    if (error.name === 'MongoError' && error.code === 11000) {
      return new APIError({
        message: 'Validation Error',
        errors: [{
          field: 'name',
          location: 'body',
          messages: ['"name" already exists'],
        }],
        status: httpStatus.CONFLICT,
        isPublic: true,
        stack: error.stack,

      });
    }
    return error;
  },
};

/**
 * @typedef Room
 */
module.exports = mongoose.model('Room', roomSchema);

