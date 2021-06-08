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

      let product;
      if (req.file)
        product = await Product.create({
          ...req.body,
          image_uri: `${process.env.API_URL}/images/${req.file.key}`
        });
      else
        product = await Product.create(req.body);

      return res.status(201).json(product);

    } catch (error) {
      if (req.file)
        deleteFile(req.file.key);
      console.log(error);
      return res.status(500).json({ msg: 'internal server error' });
    }
  },

  query: async (req, res) => {
    if (hasNull(req.query, ['limit', 'page']))
      return res.status(400).json({ msg: 'missing required data' });

    const { id_brand, category, limit, page } = req.query;

    let query = {
      where: {},
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      include: { association: 'brand' }
    };

    if (id_brand)
      query.where.id_brand = id_brand;

    if (category)
      query.where.category = category;

    try {
      const products = await Product.findAll(query);

      if (products.length === 0)
        return res.status(404).json({ msg: 'not found' });

      return res.status(200).json(products);

    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: 'internal server error' });
    }
  },

  update: async (req, res) => {
    const { id } = req.params;

    if (!id) {
      if (req.file)
        deleteFile(req.file.key);
      return res.status(400).json({ msg: 'missing required data' });
    }

    if (req.body.id_brand) {
      const brand = await Brand.findByPk(req.body.id_brand);
      if (!brand)
        return res.status(404).json({ msg: 'not found' });
    }

    try {
      const product = await Product.findByPk(id);

      if (req.file) {
        if (product.image_uri) {
          const filename = product.image_uri.split('/images/')[1];
          deleteFile(filename);
        }
        await product.update({
          ...req.body,
          image_uri: `${process.env.API_URL}/images/${req.file.key}`
        });
      }
      else
        await product.update(req.body);

      return res.status(200).json(product);

    } catch (error) {
      console.log(error);
      if (req.file)
        deleteFile(req.file.key);
      return res.status(500).json({ msg: 'internal server error' });
    }
  },

  delete: async (req, res) => {
    const { id } = req.params;

    if (!id)
      return res.status(400).json({ msg: 'missing required data' });

    try {
      const product = await Product.findByPk(id);

      if (!product)
        return res.status(404).json({ msg: 'not found' });

      if (product.image_uri) {
        const filename = product.image_uri.split('/images/')[1];
        deleteFile(filename);
      }

      await product.destroy();
      return res.status(200).json({ msg: 'product deleted' });

    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: 'internal server error' });
    }
  }

}