const Brand = require('../models/Brand');
const { hasNull } = require('../utils/hasNull');

module.exports = {
  save: async (req, res) => {

    if (!req.isAdmin)
      return res.status(403).json({ msg: 'forbidden' });

    if (hasNull(req.body, ['name']))
      return res.status(400).json({ msg: 'missing required data' });

    const { name } = req.body;

    try {
      const brand = await Brand.create({ name });
      return res.status(201).json(brand);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: 'internal server error' });
    }
  },

  listAll: async (req, res) => {
    try {
      const brands = await Brand.findAll();

      if (brands.length === 0)
        return res.status(404).json({ msg: 'not found' });

      return res.status(200).json(brands);

    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: 'internal server error' });
    }
  },

  update: async (req, res) => {

    if (!req.isAdmin)
      return res.status(403).json({ msg: 'forbidden' });

    if (hasNull(req.params, ['id']))
      return res.status(400).json({ msg: 'missing required data' });

    const { id } = req.params;
    const { name } = req.body;

    try {
      const brand = await Brand.findByPk(id);

      if (!brand)
        return res.status(404).json({ msg: 'not found' });

      await brand.update({ name });
      return res.status(200).json(brand);

    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: 'internal server error' });
    }
  },

  delete: async (req, res) => {

    if (hasNull(req.params, ['id']))
      return res.status(400).json({ msg: 'missing required data' });

    const { id } = req.params;

    try {
      const brand = await Brand.findByPk(id);

      if (!brand)
        return res.status(404).json({ msg: 'not found' });

      await brand.destroy();
      return res.status(200).json({ msg: 'brand deleted' });

    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: 'internal server error' });
    }
  }
}