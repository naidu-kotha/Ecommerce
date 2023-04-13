const express = require("express");
const bcrypt = require("bcrypt");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());
app.use(cors());

const connection = require("./connection");

const dbConnection = () => {
  try {
    connection.connect();
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

dbConnection();

// MIDDLEWARE AUTHENTICATION
const tokenAuthentication = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (authHeader === undefined) {
    res.status(401).send("Access denied. No token provided.");
  } else {
    const jwtToken = authHeader.split(" ")[1];
    jwt.verify(jwtToken, "secret_key", (error, payload) => {
      if (error) {
        res.status(401).send(error);
      } else {
        req.username = payload.username;
        next();
      }
    });
  }
};

// GET USERS
app.get("/getusers/", (req, res) => {
  connection.query("SELECT * FROM user_details", (error, results) => {
    if (error) {
      res.status(400);
      res.send(error);
    } else {
      res.send(results);
    }
  });
});

// GET PRODUCTS
app.get("/getproducts/", (req, res) => {
  const { category } = req.query;

  let query = "SELECT * FROM products";

  if (category) {
    query += ` WHERE category LIKE '${category}'`;
  }

  connection.query(query, (error, results) => {
    if (error) {
      res.status(400).send(error);
    } else {
      res.send(results);
    }
  });
});

// CREATE USER
app.post("/createuser/", async (req, res) => {
  const { id, username, password } = req.body;
  console.log(username, password);
  const hashedPassword = await bcrypt.hash(password, 10);
  //   console.log(hashedPassword);
  connection.query(
    "INSERT INTO user_details(id, username, password) values(?,?,?)",
    [id, username, hashedPassword],
    (error, results) => {
      if (error) {
        res.status(400);
        res.send(error);
      } else {
        // connection.query("SELECT * FROM user_details", (error, results) => {
        //   if (error) {
        //     res.status(500);
        //     res.send(error);
        //   } else {
        //     res.send(results);
        //   }
        // });
        // res.status(200);
        res.status(200).send(results);
      }
    }
  );
});

// UPDATE USER
app.patch("/updateuser/", (req, res) => {
  const { username } = req.query;
  const { firstname, email, mobileNumber } = req.body;

  connection.query(
    "UPDATE user_details SET first_name=?, email=?, mobile=? WHERE username=?",
    [firstname, email, mobileNumber, username],
    (error, results) => {
      if (error) {
        res.status(400);
        res.send(error);
      } else {
        res.send(results);
      }
    }
  );
});

// UPDATE PASSWORD
app.patch("/changepassword/:username/", (req, res) => {
  const { username } = req.params;
  const { oldPassword, password } = req.body;
  connection.query(
    "SELECT * FROM user_details WHERE username=?",
    [username],
    (error, results) => {
      if (error) {
        res.status(400).send(error);
        return;
      }
      if (results.length === 0) {
        res.status(404).send("User not found");
        return;
      }
      const oldHashedPassword = results[0].password;
      bcrypt.compare(oldPassword, oldHashedPassword, async (err, result) => {
        if (err) {
          console.error(err);
          res
            .status(500)
            .send("An error occurred while changing the password.");
          return;
        }
        if (!result) {
          res.status(401).send("The old password is incorrect.");
          return;
        }
        const newHashedPassword = await bcrypt.hash(password, 10);
        connection.query(
          "UPDATE user_details SET password=? WHERE username=?",
          [newHashedPassword, username],
          (err, result) => {
            if (err) {
              console.error(err);
              res
                .status(500)
                .send("An error occurred while changing the password.");
            } else {
              // console.log(result);
              res.send("Password changed successfully.");
            }
          }
        );
      });
    }
  );
});

// LOGIN
app.post("/login/", (req, res) => {
  const { username, password } = req.body;
  // console.log(username, password);
  connection.query(
    "SELECT * FROM user_details WHERE username=?",
    [username],
    (error, results) => {
      if (error) {
        res.status(400).send(error);
        return;
      }
      if (results.length === 0) {
        res.status(404);
        res.send("User not found");
        return;
      }
      const storedPassword = results[0].password;
      bcrypt.compare(password, storedPassword, (err, result) => {
        if (err) {
          res.status(500).send("An error occurred while verifying password");
          return;
        }
        if (!result) {
          res.status(401).send("Invalid Password");
          return;
        }
        const payload = { username: username };
        const jwtToken = jwt.sign(payload, "secret_key");
        delete results[0].password;
        res.send({ jwtToken, results });
        // console.log(results[0].password);
      });
    }
  );
});

// ADD NEW ITEM
app.post("/createitem/", (req, res) => {
  const { category, title, image_url, brand, price } = req.body;

  connection.query(
    "INSERT INTO products(title, brand, category, price, image_url) VALUES(?,?,?,?,?)",
    [title, brand, category, price, image_url],
    (error, results) => {
      if (error) {
        res.status(400).send(error);
        return;
      }
      res.send("Product successfully added");
    }
  );
});

// CREATE NEW ORDER
app.post("/createorder/", (req, res) => {
  const {
    id,
    category,
    item,
    firstname,
    lastname,
    email,
    mobile_no,
    address,
    pincode,
    state,
  } = req.body;

  connection.query(
    "INSERT INTO orders(id, category, item, firstname, lastname, email, mobile_no, address, pincode, state) VALUES(?,?,?,?,?,?,?,?,?,?)",
    [
      id,
      category,
      item,
      firstname,
      lastname,
      email,
      mobile_no,
      address,
      pincode,
      state,
    ],
    (error, results) => {
      if (error) {
        res.status(400).send(error);
        return;
      }
      res.send("Order successfully created");
    }
  );
});

app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});