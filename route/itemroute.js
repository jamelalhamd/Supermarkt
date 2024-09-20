const express = require('express');
const app = express();
const router = express.Router();

const authcontroler = require("../controller/authcontroler");







const itemViewControl = require('../controller/itemcontroller');  // Update the path to the new controller

// Route to view all items
router.get('/items',authcontroler.checkAuthAndFetchUser, itemViewControl.itemViewControl);

// Route to search for items
router.post('/searchitems',authcontroler.checkAuthAndFetchUser, itemViewControl.searchItemController);

// Route to view a specific item for editing
router.get('/edititem/:id',authcontroler.checkAuthAndFetchUser, itemViewControl.editItem);
router.post('/updateitem/:id',authcontroler.checkAuthAndFetchUser, itemViewControl.updateItem);

// Route to render delete item page and handle item deletion
router.post('/deleteitem/:id', authcontroler.checkAuthAndFetchUser,itemViewControl.deleteItem);
router.get('/deleteitempage/:id', authcontroler.checkAuthAndFetchUser,itemViewControl.deleteItemPage);
// Route to render add item page and handle adding a new item
router.get('/additem',authcontroler.checkAuthAndFetchUser, itemViewControl.addItemPage);
router.post('/additem', authcontroler.checkAuthAndFetchUser,itemViewControl.addItem);

// Route to view details of a specific item
router.get('/viewitem/:id',authcontroler.checkAuthAndFetchUser, itemViewControl.itemViewDetails);

module.exports = router;










