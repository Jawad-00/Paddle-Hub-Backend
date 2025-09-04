const Court = require('../models/Court');

class CourtService {
  static async createCourt(data) {
    const court = new Court(data);
    return await court.save();
  }

  static async getAllCourts() {
    return await Court.find();
  }

  static async getCourtById(id) {
    return await Court.findById(id);
  }

  static async updateCourt(id, data) {
    return await Court.findByIdAndUpdate(id, data, { new: true });
  }

  static async deleteCourt(id) {
    return await Court.findByIdAndDelete(id);
  }

  static async addClosedDate(id, closedDate) {
    const court = await Court.findById(id);
    if (!court) throw new Error("Court not found");

    court.closedDates.push(closedDate);
    await court.save();
    return court;
  }
}

module.exports = CourtService;
