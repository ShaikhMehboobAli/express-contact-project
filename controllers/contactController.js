const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel");
const { constants } = require("../constants");

//@desc Get all contacts
//@route GET /api/contacts
//@access Private
const getContact = asyncHandler(async (req, res) => {
  const contacts = await Contact.find({user_id: req.user.id});
  res.status(200).json(contacts);
});

//@desc create  contacts
//@route POST /api/contacts
//@access Private
const createContact = asyncHandler(async (req, res) => {
  console.log("req body---", req.body);
  const { name, email, phone } = req.body;
  // console.log("name--",name,email,phone)
  if (!name || !email || !phone) {
    res.status(400);
    throw new Error("All field are mandatory");
  }

  const contact = await Contact.create({
    name,
    email,
    phone,
    user_id: req.user.id
  });
  res.status(201).json(contact);
});

//@desc single  contacts
//@route GET /api/contacts/:id
//@access Private
const getSingleContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(constants.NOT_FOUND);
    throw new Error("contact not found")
  }
  res.status(201).json(contact);
});

//@desc Update  contacts
//@route PUT /api/contacts/:id
//@access Private
const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact) {
    res.status(constants.NOT_FOUND);
    throw new Error("contact not found")
  }

  if(contact.user_id.toString() !== req.user.id){
    res.status(403)
    throw new Error("User doest not have permission for edit")
  }

  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res
    .status(201)
    .json(updatedContact);
});

//@desc delete contacts
//@route DELETE /api/contacts/:id
//@access Private
const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id)
    if(!contact){
        res.status(constants.NOT_FOUND)
        throw new Error("contact not found")
    }

    if(contact.user_id.toString() !== req.user.id){
      res.status(403)
      throw new Error("User doest not have permission for edit")
    }

    await Contact.findByIdAndDelete(req.params.id);
  res
    .status(200)
    .json(contact);
});

module.exports = {
  getContact,
  createContact,
  updateContact,
  deleteContact,
  getSingleContact,
};
