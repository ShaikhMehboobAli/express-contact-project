const express = require('express');
const router = express.Router();
const {getContact,createContact,getSingleContact,updateContact,deleteContact} = require('../controllers/contactController');
const validateToken = require('../middleware/validateTokenHandler');

/*
    middleware for token validation
*/
router.use(validateToken)


/*
    it has 2 routes 
    - router.route('/').get(getContact) and
    - router.route('/').post(createContact)
*/
router.route('/').get(getContact).post(createContact)



/*
    it has 3 routes 
    - router.route('/:id').get(getSingleContact) and
    - router.route('/:id').put(updateContact)
    - router.route('/:id').delete(deleteContact)
*/
router.route('/:id').get(getSingleContact).put(updateContact).delete(deleteContact)


module.exports = router