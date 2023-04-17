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
  const { id, username, password, role } = req.body;
  console.log(username, password, role);
  const hashedPassword = await bcrypt.hash(password, 10);
  //   console.log(hashedPassword);
  connection.query(
    "INSERT INTO user_details(id, username, password, role) values(?,?,?,?)",
    [id, username, hashedPassword, role],
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
  const { fullname, email, mobile } = req.body;

  connection.query(
    "UPDATE user_details SET fullname=?, email=?, mobile=? WHERE username=?",
    [fullname, email, mobile, username],
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
app.patch("/changepassword/", (req, res) => {
  const { username } = req.query;
  const { oldPassword, password } = req.body;
  console.log(oldPassword, password, username);
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

// ADD NEW PRODUCT TO TABLE
app.post("/addproduct/", (req, res) => {
  const { title, category, imageUrl, price, brand } = req.body;

  connection.query(
    "INSERT INTO products (title, category, image_url, price, brand) VALUES (?, ?, ?, ?, ?)",
    [title, category, imageUrl, price, brand],
    (error, results) => {
      if (error) {
        res.status(400).send(error);
        return;
      }
      const message = "Product added successfully";
      res.send({ results, message });
    }
  );
});

// ADD TO CART
app.post("/addtocart/", (req, res) => {
  // const { username } = req.query;
  const { item, quantity, username } = req.body;
  const { id, category, title, imageUrl, brand, price } = item;
  // console.log(id, category, title, imageUrl, brand, price, quantity);
  connection.query(
    "INSERT INTO cart(id, username, title, brand, category, price, image_url, quantity) VALUES(?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)",
    [id, username, title, brand, category, price, imageUrl, quantity],
    (error, results) => {
      if (error) {
        res.status(400).send(error);
        return;
      }
      const message = "Product successfully added";
      res.send({ results, message });
    }
  );
});

// GET PRODUCTS FROM CART
app.get("/getitems/", (req, res) => {
  const { username } = req.query;
  // console.log(username);
  connection.query(
    `SELECT * FROM cart WHERE username='${username}'`,
    (error, results) => {
      if (error) {
        res.status(400).send(error);
        return;
      }
      console.log(results);
      res.send(results);
    }
  );
});

// CREATE NEW ORDER
app.post("/createorder/", (req, res) => {
  const {
    id,
    username,
    category,
    title,
    fullname,
    email,
    mobileNumber,
    address,
    postalCode,
    state,
    quantity,
    deliveryDate,
  } = req.body;

  const date = new Date(deliveryDate);
  console.log(date.toLocaleDateString("en-GB"));

  connection.query(
    "SELECT image_url, price FROM products WHERE title=?",
    [title],
    (error, results) => {
      if (error) {
        res.send(error).status(400);
        return;
      }
      // console.log(results);
      const { image_url, price } = results[0];

      // console.log(image_url);

      connection.query(
        "INSERT INTO orders(id, username, category, title, image_url, price, fullname, email, mobile, address, pincode, state, quantity, delivery_date) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [
          id,
          username,
          category,
          title,
          image_url,
          price,
          fullname,
          email,
          mobileNumber,
          address,
          postalCode,
          state,
          quantity,
          date,
        ],
        (error, results) => {
          if (error) {
            res.status(400).send(error);
            return;
          }
          // console.log(results);
          res.send("Order successfully created");
        }
      );
    }
  );
});

// GET ORDERS
app.get("/getorders/", (req, res) => {
  const { username } = req.query;

  if (username) {
    connection.query(
      `SELECT * FROM orders WHERE username='${username}'`,
      (error, results) => {
        if (error) {
          res.status(400).send(error);
          return;
        }
        console.log(results);
        res.send(results);
      }
    );
  } else {
    connection.query("SELECT * FROM orders", (error, results) => {
      if (error) {
        res.status(400).send(error);
        return;
      }
      console.log(results);
      res.send(results);
    });
  }
});

// REMOVE ITEM FROM CART
app.delete("/deleteitem/", (req, res) => {
  const { id } = req.body;
  const { username } = req.query;
  console.log(id, username);

  let query = "";

  if (id) {
    query = "DELETE FROM cart WHERE id=? AND username=?";
    connection.query(query, [id, username], (error, results) => {
      if (error) {
        res.status(400).send(error);
      } else {
        const message = "Product successfully deleted";
        res.send({ results, message });
      }
    });
  } else {
    query = "DELETE FROM cart WHERE username=?";
    connection.query(query, [username], (error, results) => {
      if (error) {
        res.status(400).send(error);
      } else {
        const message = "All products for the user successfully deleted";
        res.send({ results, message });
      }
    });
  }
});

app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});
