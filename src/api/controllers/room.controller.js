const httpStatus = require('http-status');
const APIError = require('../errors/api-error');
const roomService = require('../services/room/room.service');

/**
 * Create a new room
 * @public
 */
exports.createRoom = async (req, res, next) => {
  try {
    const { name, members } = req.body;
    const userId = req.user._id;

    if (!name || !Array.isArray(members)) {
      throw new APIError({

        status: httpStatus.BAD_REQUEST,
        message: 'Room name and members are required',
        isPublic: true,
      });
    }


    const room = await roomService.createRoom(name, members, userId);


    res.status(httpStatus.CREATED).json({ room });
  } catch (error) {
    next(error);
  }
};

/**
 * Get a room by ID
 * @public
 */
exports.getRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const room = await roomService.getRoomById(roomId);

    if (!room) {
      throw new APIError({

        status: httpStatus.NOT_FOUND,
        message: 'Room not found',
        isPublic: true,
      });
    }


    res.json({ room });
  } catch (error) {

    next(error);
  }
};

/**
 * Get all rooms for a user
 * @public
 */
exports.getUserRooms = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const rooms = await roomService.getRoomsByUser(userId);

    res.json({ rooms });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a room
 * @public

 */
exports.deleteRoom = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id;

    const deleted = await roomService.deleteRoom(roomId, userId);

    if (!deleted) {
      throw new APIError({
        status: httpStatus.NOT_FOUND,
        message: 'Room not found or unauthorized',
        isPublic: true,
      });

    }

    res.status(httpStatus.NO_CONTENT).end();
  } catch (error) {
    next(error);
  }

};

