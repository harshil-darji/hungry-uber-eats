const { customer } = require('../models/data-model');

const createCustomer = async (req, res) => {
  try {
    // Check if email already exists
    const checkUser = await customer.findOne({
      where: { emailId: req.body.emailId },
    });
    if (checkUser) {
      return res.status(409).json({
        error: "There's already an account with this email. Please sign in.",
      });
    }
    // Else create new customer
    const cust = await customer.create(req.body);
    return res.status(201).json({
      cust,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getCustomer = async (req, res) => {
  try {
    const { custId } = req.params;
    const user = await customer.findOne({
      where: { custId },
    });
    if (user) {
      return res.status(200).json({ user });
    }
    return res
      .status(404)
      .json({ error: 'Customer with the specified ID does not exist!' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { custId } = req.params;
    const [updated] = await customer.update(req.body, {
      where: { custId },
    });
    if (updated) {
      const updatedUser = await customer.findOne({ where: { custId } });
      return res.status(200).json({ user: updatedUser });
    }
    return res.status(404).json({ error: 'User not found!' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const { custId } = req.params;
    const deleted = await customer.destroy({
      where: { custId },
    });
    if (deleted) {
      return res
        .status(200)
        .json({ message: 'Customer deleted successfully!' });
    }
    return res.status(404).json({ error: 'User not found!' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createCustomer,
  getCustomer,
  updateCustomer,
  deleteCustomer,
};
