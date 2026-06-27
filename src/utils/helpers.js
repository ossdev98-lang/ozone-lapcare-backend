const slugify = (text) =>
  text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');

const generateOrderNumber = () => 'OLC-' + Date.now().toString(36).toUpperCase();

module.exports = { slugify, generateOrderNumber };
