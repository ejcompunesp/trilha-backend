const { isCategory } = require('../config/categories');
const { deleteFile } = require('../utils/file');
const { hasNull } = require('../utils/hasNull');
const Product = require('../models/Product');
const Brand = require('../models/Brand');

module.exports = {
  save: async (req, res) => {

    if (!req.isAdmin) {
      if (req.file)
        deleteFile(req.file.key);
      return res.status(403).json({ msg: 'forbidden' });
    }

    if (hasNull(req.body, ['id_brand', 'name', 'price', 'category']))
      return res.status(400).json({ msg: 'missing required data' });

    if (!isCategory(req.body.category)) {
      if (req.file)
        deleteFile(req.file.key);
      return res.status(400).json({ msg: 'category is invalid' });
    }

    try {
      const brand = await Brand.findByPk(req.body.id_brand);

      if (!brand) {
        if (req.file)
          deleteFile(req.file.key);
        return res.status(404).json({ msg: 'not found' });
      }

      const product = await Product.create({
        ...req.body,
        image_uri: `${process.env.API_URL}/images/${req.file.key}`
      });

      return res.status(201).json(product);

    } catch (error) {
      if (req.file)
        deleteFile(req.file.key);
      console.log(error);
      return res.status(500).json({ msg: 'internal server error' });
    }
  },

  query: async (req, res) => {
    const { id_brand, category, limit, page } = req.query;

    try {

    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: 'internal server error' });
    }
  }

}