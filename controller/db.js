
const mysql = require('mysql');
const jwt = require('jsonwebtoken');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'j_hamad83',
  password: 'Afpc1967#',
  database: 'supermarkt_db'
});

// Connect to the database
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Connected to MySQL database');
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




module.exports = {fetchInvoiceItems,getInvoiceById,getInvoiceItemsById,
  db,getPromotionData,getInvoice,
  getUser,getItemData,
  getStoreData,
  getSupplierData
};
