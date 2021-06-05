const User = require('../models/User');
const { generateHash, generateToken, validPassword } = require('../utils/auth');

const { hasNull } = require('../utils/hasNull');

module.exports = {
  save: async (req, res) => {

    if (hasNull(req.body, ['name', 'email', 'password']))
      return res.status(400).json({ msg: 'missing required data' });

    try {
      const userExists = await User.findOne({ where: { email: req.body.email } });

      if (userExists)
        return res.status(400).json({ msg: 'user already exists' });

      const user = await User.create({ ...req.body, password: await generateHash(req.body.password) });
      user.password = undefined;
      return res.status(201).json({ user, token: generateToken({ id: user.id, isAdmin: user.is_admin }) });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: 'internal server error' });
    }
  },

  login: async (req, res) => {

    if (hasNull(req.body, ['email', 'password']))
      return res.status(400).json({ msg: 'missing required data' })

    const { email, password } = req.body;

    try {

      const user = await User.findOne({ where: { email } });

      if (!user)
        return res.status(400).json({ msg: 'email or password is invalid' });

      if (!(await validPassword(password, user.password)))
        return res.status(400).json({ msg: 'email or password is invalid' });

      user.password = undefined;
      return res.status(200).json({ user, token: generateToken({ id: user.id, isAdmin: user.is_admin }) });

    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: 'internal server error' });
    }
  },

  listAll: async (req, res) => {

    if (!req.isAdmin)
      return res.status(403).json({ msg: 'forbidden' });

    try {

      const users = await User.findAll({
        where: { is_admin: 0 },
        attributes: { exclude: ['password'] }
      });

      if (users.length === 0)
        return res.status(404).json({ msg: 'not found' });

      return res.status(200).json(users);

    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: 'internal server error' });
    }
  },

  update: async (req, res) => {

    try {
      const user = await User.findByPk(req.id);

      if (!user)
        return res.status(404).json({ msg: 'not found' });

      const { oldPassword, password } = req.body;
      if (password) {
        if (oldPassword) {
          if (!(await validPassword(oldPassword, user.password)))
            return res.status(400).json({ msg: 'password is invalid' });

          await user.update({ ...req.body, password: await generateHash(password) });
        }
        else
          return res.status(400).json({ msg: 'missing required data' })
      }
      else
        await user.update(req.body);

      user.password = undefined;
      return res.status(200).json(user);

    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: 'internal server error' });
    }
  },

  delete: async (req, res) => {
    if (req.isAdmin)
      return res.status(403).json({ msg: 'admin can not delete himself' });

    try {
      const user = await User.findByPk(req.id);

      if (!user)
        return res.status(404).json({ msg: 'not found' });

      await user.destroy();
      return res.status(200).json({ msg: 'user deleted' });

    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: 'internal server error' });
    }
  }
}