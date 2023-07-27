const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const knex = require("knex");
const app = express();
const multer = require("multer");

const db = knex({
  client: "mysql",
  connection: {
    host: process.env.MYSQL_HOST || "127.0.0.1",
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USER || "root",
    password: process.env.MYSQL_PASS || "123456",
    database: process.env.MYSQL_DB || "iote1-5",
    supportBigNumber: true,
    timezone: "+7:00",
    dateStrings: true,
    charset: "utf8mb4_unicode_ci",
  },
});

app.use(cors());
app.use(bodyParser.json());
app.get("/", (req, res) => {
  console.log("test api");
  res.send({ ok: 1 });
});
app.get("/lists", async (req, res) => {
  console.log("lists");
  let row = await db("users_advisor");
  // .where("major_id", 98)
  res.send({
    datas: row,
    status: 1,
  });
});

app.get("/list", async (req, res) => {
  try {
    console.log("show user");
    let row = await db("member");
    // .where("major_id", 98)
    res.send({
      datas: row,
      status: 1,
    });
  } catch (e) {
    console.log(e.message);
    res.send({
      ok: 0,
      error: e.message,
    });
  }
});

app.get("/update", async (req, res) => {
  try {
    console.log(req.query);
    let row = await db("member").where("id", "=", req.query.id).update({
      username: req.query.username,
      password: req.query.passwd,
      dep: req.query.dep,
    });
    console.log("row=", row);
    res.send({
      ok: 1,
      data: row,
    });
  } catch (e) {
    console.log(e.message);
    res.send({
      ok: 0,
      error: e.message,
    });
  }
});

app.get("/del", async (req, res) => {
  try {
    console.log("show id", req.query.id);
    let row = await db("member").where("id",'=' , req.query.id).del();
    res.send({
      datas: row,
      status: 1,
    });
  } catch (e) {
    console.log(e.message);
    res.send({
      ok: 0,
      error: e.message,
    });
  }
});

app.get("/listedit", async (req, res) => {
  console.log("show id", req.query);
  let row = await db("member").where("id", req.query.id);
  res.send({
    datas: row[0],
    status: 1,
  });
});

app.get("/insert", async (req, res) => {
  try {
    console.log(req.query);
    console.log(req.query.name);
    ids = await db("member").insert({
      username: req.query.name,
      password: req.query.passwd,
      dep: req.query.dep,
    });
    res.send({
      ok: 1,
      data: req.query,
      ids: ids[0],
    });
  } catch (e) {
    console.log(e.message);
    res.send({
      ok: 0,
      error: e.message,
    });
  }
});

app.listen(7001, () => {
  console.log("ready:candle:7001");
});
