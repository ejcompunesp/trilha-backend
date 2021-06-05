const CategoriesEnum = Object.freeze({
  TECLADO: 'teclado',
  MOUSE: 'mouse',
  HEADSET: 'headset',
});

module.exports = {
  CategoriesEnum,
  isCategory: (category) => {
    if (Object.values(CategoriesEnum).includes(category))
      return true;
    return false;
  }
};