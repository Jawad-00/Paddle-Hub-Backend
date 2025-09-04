const AuthService = require('../services/auth.service');

class AuthController {
  static async register(req, res) {
    try {
      const { email, phone, password, role } = req.body;
      const user = await AuthService.register(email, phone, password, role);
      res.status(201).json({ message: 'User registered', user });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const { token} = await AuthService.login(email, password);
      res.json({ token});
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}

module.exports = AuthController;
