const Room = require('../../models/room.model');
const APIError = require('../../errors/api-error');
const httpStatus = require('http-status');

const createRoom = async (roomData) => {
  const room = new Room(roomData);
  return room.save();
};

const getRoomById = async (id) => {
  const room = await Room.findById(id).populate('admin').populate('members');
  if (!room) {

    throw new APIError({ message: 'Room not found', status: httpStatus.NOT_FOUND });
  }
  return room;
};

const updateRoom = async (id, updateData) => {
  const room = await Room.findByIdAndUpdate(id, updateData, { new: true });
  if (!room) {
    throw new APIError({ message: 'Room not found', status: httpStatus.NOT_FOUND });
  }
  return room;
};

const deleteRoom = async (id) => {
  const room = await Room.findByIdAndDelete(id);
  if (!room) {

    throw new APIError({ message: 'Room not found', status: httpStatus.NOT_FOUND });
  }
  return room;
};

const listRooms = async (filter = {}, options = {}) => {
  const { page = 1, limit = 10 } = options;
  return Room.find(filter)
    .sort({ createdAt: -1 })
    .skip(limit * (page - 1))
    .limit(limit)
    .populate('admin')
    .populate('members')
    .exec();
};


module.exports = {
  createRoom,
  getRoomById,
  updateRoom,
  deleteRoom,

  listRooms,

};

