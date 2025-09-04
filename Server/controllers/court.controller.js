const CourtService = require("../services/court.service");
const cloudinary = require("../config/cloudinary");
class CourtController {
 static async createCourt(req, res) {
    try {
      let imageUrl;
      if (req.file) {
          imageUrl = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "padel-hub/courts" },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result.secure_url);
              }
            }
          );
          uploadStream.end(req.file.buffer);
        });
    }
      const data = { ...req.body, image: imageUrl };
      const court = await CourtService.createCourt(data);
      res.status(201).json({ message: "Court created", court });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
    }
  static async getCourts(req, res) {
    try {
      const courts = await CourtService.getAllCourts();
      res.json(courts);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async getCourt(req, res) {
    try {
      const court = await CourtService.getCourtById(req.params.id);
      if (!court) return res.status(404).json({ error: "Court not found" });
      res.json(court);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async updateCourt(req, res) {
    try {
      const court = await CourtService.updateCourt(req.params.id, req.body);
      if (!court) return res.status(404).json({ error: "Court not found" });
      res.json({ message: "Court updated", court });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async deleteCourt(req, res) {
    try {
      const court = await CourtService.deleteCourt(req.params.id);
      if (!court) return res.status(404).json({ error: "Court not found" });
      res.json({ message: "Court deleted" });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async addClosedDate(req, res) {
    try {
      const { date, reason } = req.body;
      const court = await CourtService.addClosedDate(req.params.id, { date, reason });
      res.json({ message: "Closed date added", court });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = CourtController;
