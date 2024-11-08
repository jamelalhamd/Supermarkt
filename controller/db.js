
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
require('dotenv').config();


const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});





// Connect to the database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
  console.log("process.env.HOST :"+process.env.DB_HOST)
  console.log("process.env.DB_USER :"+process.env.DB_USER)
  console.log("process.env.DB_PASSWORD :"+process.env.DB_PASS)
  console.log("process.env.DATABASE :"+process.env.DB_NAME)
});

// Fetch store data
const getStoreData = () => {
  return new Promise((resolve, reject) => {
    const storeQuery = 'SELECT * FROM store';
    db.query(storeQuery, (err, storeResults) => {
      if (err) {
        console.error("Error fetching store data: " + err);
        return reject("Error fetching store data: " + err);
      }
      resolve(storeResults);
    });
  });
};







const getSupplierData = () => {
  return new Promise((resolve, reject) => {
    const supplierQuery = 'SELECT * FROM supplier'; // Query to fetch all suppliers
    db.query(supplierQuery, (err, supplierResults) => {
      if (err) {
        console.error("Error fetching supplier data: " + err);
        return reject("Error fetching supplier data: " + err);
      }
      resolve(supplierResults);
    });
  });
};



const getSupplierbyid = (id) => {
  return new Promise((resolve, reject) => {
    const supplierQuery = 'SELECT * FROM supplier where SupplierID=?'; // Query to fetch all suppliers
    db.query(supplierQuery, [id],(err, supplierResults) => {
      if (err) {
        console.error("Error fetching supplier data: " + err);
        return reject("Error fetching supplier data: " + err);
      }
      resolve(supplierResults);
    });
  });
};

const getuserbyid = (id) => {
  return new Promise((resolve, reject) => {
    const supplierQuery = 'SELECT * FROM employees where employee_id=?'; // Query to fetch all suppliers
    db.query(supplierQuery, [id],(err, supplierResults) => {
      if (err) {
        console.error("Error fetching supplier data: " + err);
        return reject("Error fetching supplier data: " + err);
      }
      resolve(supplierResults);
    });
  });
};


const getUser = (req, res) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, process.env.SECRET_KEY || 'jamel2', (err, decoded) => {
      if (err) {
        res.locals.user = null;
        return;
      }

      const email = decoded.email;
      const sql = 'SELECT * FROM employees WHERE employee_email = ?';
      
      db.query(sql, [email], (err, results) => {
        if (err) {
          res.locals.user = null;
          return;
        }

        if (results.length === 0) {
          res.locals.user = null;
        } else {
          res.locals.user = results[0];
          return res.locals.user;
        }
      });
    });
  } else {
    res.locals.user = null;
  }
};



const getItemData = () => {
  return new Promise((resolve, reject) => {
    const itemQuery = 'SELECT * FROM item'; // Query to fetch items
    db.query(itemQuery, (err, itemResults) => {
      if (err) {
        console.error("Error fetching item data: " + err);
        return reject("Error fetching item data: " + err); 
      }
      resolve(itemResults); // Resolve with the results from the database
    });
  });
};


const getPromotionData = () => {
  return new Promise((resolve, reject) => {
    const promotionQuery = 'SELECT * FROM promotion'; 
    db.query(promotionQuery, (err, promotionResults) => {
      if (err) {
        console.error("Error fetching promotion data: " + err);
        return reject("Error fetching promotion data: " + err); 
      }
      resolve(promotionResults); 
    });
  });
};

const fetchInvoiceItems = async (invoiceid) => {
  const sqlFetchItems = `SELECT * FROM salesinvoiceitem WHERE salesinvoiceID = ?`;
  return new Promise((resolve, reject) => {
    db.query(sqlFetchItems, [invoiceid], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};



const getInvoiceById = async (id) => {
  const sqlInvoice = `SELECT * FROM salesinvoice WHERE salesinvoiceID = ?`;

  try {
    const invoicedata = await new Promise((resolve, reject) => {
      db.query(sqlInvoice, [id], (err, results) => {
        if (err) return reject(err);
        resolve(results[0]); // Assuming only one invoice is returned
      });
    });

    return invoicedata;
  } catch (error) {
    throw new Error(`Error fetching invoice with ID ${id}: ${error.message}`);
  }
};




const getInvoice = async (id) => {
  const sqlInvoice = `SELECT * FROM salesinvoice `;

  try {
    const invoicedata = await new Promise((resolve, reject) => {
      db.query(sqlInvoice, [id], (err, results) => {
        if (err) return reject(err);
        resolve(results); // Assuming only one invoice is returned
      });
    });

    return invoicedata;
  } catch (error) {
    throw new Error(`Error fetching invoice with ID ${id}: ${error.message}`);
  }
};




const getInvoiceItemsById = async (id) => {
  const sqlInvoiceItems = `SELECT * FROM salesinvoiceitem WHERE salesinvoiceID = ?`;

  try {
    const invoiceitemdata = await new Promise((resolve, reject) => {
      db.query(sqlInvoiceItems, [id], (err, results) => {
        if (err) return reject(err);
        resolve(results); // Return all invoice items
      });
    });

    return invoiceitemdata;
  } catch (error) {
    throw new Error(`Error fetching invoice items for invoice ID ${id}: ${error.message}`);
  }
};




const getBysalesinvoiceitemID = async (id) => {
  const sqlInvoiceItems = `SELECT * FROM salesinvoiceitem WHERE salesinvoiceitemID = ?`;

  try {
    const invoiceitemdata = await new Promise((resolve, reject) => {
      db.query(sqlInvoiceItems, [id], (err, results) => {
        if (err) return reject(err);
        resolve(results); // Return all invoice items
      });
    });

    return invoiceitemdata;
  } catch (error) {
    throw new Error(`Error fetching invoice items for invoice ID ${id}: ${error.message}`);
  }
};





const getpurchesesinvoice= async () => {
  try {
    const sqlvoices = `SELECT * FROM purchase`;
    const invoices = await new Promise((resolve, reject) => {
      db.query(sqlvoices, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

 
    return invoices ;
    // Alternatively, if you want to return JSON:
    // return res.json(invoices);
  } catch (error) {
    console.error("Error fetching purchases:", error);
    return null;
  }
};


const getpurchesesinvoicebyid= async (id) => {
  try {
    const sqlvoices = `SELECT * FROM purchase WHERE PurchaseID=? `;
    const invoices = await new Promise((resolve, reject) => {
      db.query(sqlvoices,[id], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

 
    return invoices ;
    // Alternatively, if you want to return JSON:
    // return res.json(invoices);
  } catch (error) {
    console.error("Error fetching purchases:", error);
    return null;
  }
};

const getEmployees = async (req, res) => {
  try {
    
      const sql = "SELECT * FROM employees";


      const result = await runQuery(sql);

    
     return result;
  } catch (error) {

      console.error("Error fetching employees:", error);
      res.status(500).send("Error fetching employees");
  }
};


        
const getpurcheseitem = async (id) => {
  try {
    const sqlQuery = `SELECT * FROM purchaseitem WHERE purchaseID=?`;
    const items = await new Promise((resolve, reject) => {
      db.query(sqlQuery, [id], (err, results) => {
        if (err) {
          console.error(`Error fetching purchase items for purchaseID ${id}:`, err);
          return reject(err);
        }
        resolve(results);
      });
    });

    return items; // Return the retrieved items
  } catch (error) {
    console.error("Error fetching purchases:", error);
    return []; // Return an empty array instead of null
  }
};


const updatequanity=async(itemid,quantity)=>{

  const sqlOriginalItem = `SELECT * FROM item WHERE ItemID = ?`;
  const originalItemResult = await new Promise((resolve, reject) => {
      db.query(sqlOriginalItem, [itemid], (err, results) => {
          if (err) return reject(err);
          resolve(results);
      });
  });

  if (originalItemResult.length === 0) {
      console.error("No original item found.");
      return res.status(500).send("Original item not found.");
  }

  // Extract current quantity from the original item
  const originalItem = originalItemResult[0]; // First result
  const currentQuantity = originalItem.quantity; // Assuming the column name is 'Quantity'

  // Calculate the new quantity after deletion
  const newQuantity = currentQuantity - parseInt(quantity, 10); // Convert quantity to an integer if necessary

  // Update the item with the new quantity
  const sqlUpdateItem = `UPDATE item SET quantity = ? WHERE ItemID = ?`;
  db.query(sqlUpdateItem, [newQuantity, itemid], (err, result) => {
      if (err) {
        console.log(object)
          console.error("Error updating item quantity:", err);
          const data = {
            title: "sales/addinvoice",
            msg: "Error updating item quantity:", err,
            style: 'danger',
            items: invoiceItems,
            salesinvoiceID: invoiceid
        };
        return res.render('home', { data });
      }

      // Render the updated page with success message
     
  });



}





const getpurcheseitembyid = async (PurchaseItemid ) => {
  try {
    const sqlFetchItemsBeforeAdd = `SELECT * FROM purchaseitem WHERE PurchaseItemid = ?`;
    
    const invoiceItemsBeforeAdd = await new Promise((resolve, reject) => {
      db.query(sqlFetchItemsBeforeAdd, [PurchaseItemid], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });

    return invoiceItemsBeforeAdd; // Returns the fetched items
  } catch (error) {
    console.error("Error fetching items before adding:", error);
    throw error; // Optionally throw the error to handle it later
  }
};





const runQuery = (sql, params) => {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
};



const categoriesArray = [
  "Dairy",
  "Bakery",
  "Meat",
  "Produce",
  "Canned Goods",
  "Frozen Foods",
  "Vegetables",
  "Fruits",
  "Beverages",
  "Snacks",
  "Condiments",
  "Seafood",
  "Grains",
  "Pasta",
  "Sauces",
  "Oils",
  "Spices",
  "Breakfast Foods",
  "Health Foods"
];

const unitsArray = [
  "Kilogram (kg)",
  "Gram (g)",
  "Milligram (mg)",
  "Liter (l)",
  "Milliliter (ml)",
  "Piece",
  "Pack",
  "Box",
  "Dozen",
  "Meter (m)",
  "Centimeter (cm)",
  "Inch"
];


const itemStatesArray = [
  "Damaged", // Damaged goods
   // Spoiled
  "In Store", // Available in the store/warehouse
  "On Shelf", // Placed on the shelf
  "Out of Stock", // Temporarily unavailable
  "Expired", // Expired goods
  "In Transit", // Being transported
  "In Inspection", // Under quality control
  "Reserved", // Reserved for customer
  "Returned", // Returned by customer
  "Awaiting Restock" // Waiting for restock
];


const getcosts = async () => {
  try {
      // SQL query to select all costs
      const Sql = "SELECT * FROM costs";
      
      // Await the result of the database query
      const result = await runQuery(Sql);
      
      // Return the result
      return result;
  } catch (error) {
      // Log the error for debugging
      console.error("Error retrieving costs:", error);
      // You might want to handle the error further, e.g., throw it or return a specific value
      throw error; // Rethrow the error after logging
  }
};



const getcostsbyid = async (id) => {
  try {

      // SQL query to select all costs
      const Sql = "SELECT * FROM costs where costID=?";
      
      // Await the result of the database query
      const result = await runQuery(Sql,[id]);
      
      // Return the result
      return result;
  } catch (error) {
      // Log the error for debugging
      console.error("Error retrieving costs:", error);
      // You might want to handle the error further, e.g., throw it or return a specific value
      throw error; // Rethrow the error after logging
  }
};




module.exports = {fetchInvoiceItems,getInvoiceById,getInvoiceItemsById,getpurchesesinvoice,getpurcheseitem,runQuery,getSupplierbyid , categoriesArray ,
  db,getPromotionData,getInvoice ,getcostsbyid,getuserbyid ,
  getUser,getItemData,updatequanity,getpurcheseitembyid ,getEmployees,getBysalesinvoiceitemID,itemStatesArray,unitsArray,
  getStoreData, getpurchesesinvoicebyid,getcosts,getInvoiceById,
  getSupplierData
};



