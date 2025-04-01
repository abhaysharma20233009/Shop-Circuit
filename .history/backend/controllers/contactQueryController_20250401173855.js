const  ContactQuery =require( "../models/contactQueryModel.js");

// Create a new contact query
exports.createQuery = async (req, res) => {
  try {
    console.log("createQuery"+req.user);
    const { name, email, message } = req.body;
    const newQuery = await ContactQuery.create({ name, email, message });
    res.status(201).json(newQuery);
  } catch (error) {
    res.status(500).json({ error: "Failed to create contact query" });
  }
};

// Get all contact queries (Admin Only)
exports.getAllQueries = async (req, res) => {
  try {
    const queries = await ContactQuery.find().sort({ createdAt: -1 });
    res.status(200).json(queries);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch contact queries" });
  }
};

// Get a single query by ID
exports.getQueryById = async (req, res) => {
  try {
    const query = await ContactQuery.findById(req.params.id);
    if (!query) return res.status(404).json({ error: "Query not found" });
    res.status(200).json(query);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch query" });
  }
};

// Update query status
exports.updateQueryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const updatedQuery = await ContactQuery.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!updatedQuery) return res.status(404).json({ error: "Query not found" });
    res.status(200).json(updatedQuery);
  } catch (error) {
    res.status(500).json({ error: "Failed to update query status" });
  }
};
