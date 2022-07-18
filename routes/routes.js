const fs = require('fs');
const express = require("express");

const router = express.Router();

const searchController = require('../controllers/search.controller');

const loginController = require('../controllers/login.controller');

const detailController = require('../controllers/detail.controller');

const customerSearchController = require('../controllers/search.customer.controller');

const addCustomerController = require('../controllers/add.customer.controller');

const addVehicleController = require('../controllers/add.Vehicle.controller');

const salesController = require('../controllers/sales.controller');

const serviceController = require('../controllers/service.controller');


//load login page
router.get('/login', loginController.login);

//post login page
router.post('/login', loginController.loginAuthentication);

//logout
router.get('/logout', loginController.logout);

//search
router.get('/search', searchController.homeSearch);

//Vehicle detail
router.get('/detail/:VIN', detailController.detail);

router.post('/detail/:VIN', detailController.detail);
//ajax, update model name based on make on search vehicle page
router.get('/search/vehicle/ajax', searchController.ajax);


//load customer search page
router.get('/searchCustomer', customerSearchController.customerSearchPage);

//search customer
router.post('/searchCustomer', customerSearchController.customerSearch);

//load add customer page
router.get('/addCustomer', addCustomerController.addCustomerPage);

//add customer
router.post('/addCustomer', addCustomerController.addCustomer);

// view customer detail info
router.get('/customerDetail/:customer_id', customerSearchController.customerDetail);

// load edit customer page
router.get('/editCustomer/:customer_id', addCustomerController.editCustomerPage);

// edit customer
router.post('/editCustomer/:customer_id', addCustomerController.editCustomer);

// delete customer
router.get('/deleteCustomer/:customer_id', addCustomerController.deleteCustomer);

// load add vehicle page
router.get('/addVehicle', addVehicleController.addVehiclePage)

// load add vehicle page
router.post('/addVehicle', addVehicleController.addVehicle)

//ajax, update model name based on make on add vehicle page
router.get('/addVehicle/vehicle/ajax', searchController.ajax);

// load sales page
router.get('/sales/:VIN', salesController.salesPage);

// add sales
router.post('/sales/:VIN', salesController.sales);

// load service page
router.get('/service/:VIN', serviceController.servicePage)

router.post('/updateService/:VIN', serviceController.updateService);

router.post('/closeService/:VIN', serviceController.finishService);


module.exports = router;