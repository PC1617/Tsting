import { createRequire } from "module";
const require = createRequire(import.meta.url);

import { fileURLToPath } from "url";
import { dirname } from "path";
// // const InfluxDB = require('https://unpkg.com/@influxdata/influxdb-client-browser/dist/index.browser.mjs')
// import { InfluxDB, Point } from "./influxProgram.js";   //<-- Working

// import { InfluxDB, Point } from "https://unpkg.com/@influxdata/influxdb-client-browser/dist/index.browser.mjs";

import { InfluxDB } from "@influxdata/influxdb-client";
import { Point } from "@influxdata/influxdb-client";

const __dirname = dirname(fileURLToPath(import.meta.url));

const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const knex = require("knex");

const openwin = require("open");
const port = process.env.PORT || 3030;
// import { fetchUser } from './public/js/influx_login.js'

// import { fetchUser } from './influx_login';

// const f = require('./influx_login.js');

let url = "https://eu-central-1-1.aws.cloud2.influxdata.com/";
let token =
  "WyskRtLpDBl9p78HZSz1usnpFi68j0t9LiB7YmxNixlzJKxE8JzAJ20C1WK8V2qpUX2MZourn-ulW-4v1chZGw==";
let org = "Rpi-Project";

const influx2 = new InfluxDB({ url, token });

let query3 =
  'from(bucket: "MetaData")\
                |> range(start: -30d)\
                |> filter(fn: (r) => r["_measurement"] == "LoginIds")\
                |> filter(fn: (r) => r["Credentials"] == "UsernamePassword")\
                |> filter(fn: (r) => r["_field"] == "Credentials")\
                |> unique()\
                |> yield(name: "unique")';
var UserPass = [];
let text = "";

function fetchAllUsers(fluxQuery) {
  UserPass = [];
  const queryApi = new InfluxDB({ url, token }).getQueryApi(org);
  queryApi.queryRows(fluxQuery, {
    next(row, tableMeta) {
      const o = tableMeta.toObject(row);
      UserPass.push(o._value);
    },
    complete() {
      console.log("FINISHED");
      console.log(UserPass);

      UserPass.forEach(printingVolume);

      // console.log(text);
      // return UserPass;
    },
    error(error) {
      console.log("QUERY FAILED", error);
    },
  });
  return UserPass;
}

function printingVolume(item) {
  text += item;
}

function fetchUser() {
  console.log(fetchAllUsers(query3));
  console.log("here");
}

const app = express();
let intialPath = path.join(__dirname, "public");
let credentials = "";
app.use(bodyParser.json());
app.use(express.static(intialPath));

app.get("/", (req, res) => {
  res.sendFile(path.join(intialPath, "index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(intialPath, "login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(intialPath, "register.html"));
});

app.get("/NoiceData", (req, res) => {
  res.sendFile(path.join(intialPath, "NoiceData.html"));
  // fetchUser()
});

app.post("/register-user", (req, res) => {
  const { name, password } = req.body;
  // res.sendFile(path.join(intialPath, "index.html"));

  if (!name.length || !password.length) {
    res.json("fill all the fields");
  } else {
    const writeApi = influx2.getWriteApi(org, "MetaData");
    const point = new Point("LoginIds")
      .tag("Credentials", "UsernamePassword")
      .stringField("Credentials", "[" + name + ":" + password + "]");
    writeApi.writePoint(point);
    console.log("Completed");
    res.json("Successfull");

    // credentials = fetchAllUsers(query2);
    // console.log(credentials)

    // db("users").insert({
    //     name: name,
    //     email: email,
    //     password: password
    // })
    // .returning(["name", "email"])
    // .then(data => {
    //     res.json(data[0])
    // })
    // .catch(err => {
    //     if(err.detail.includes('already exists')){
    //         res.json('email already exists');
    //     }
    // })
  }
});

app.post("/login-user", (req, res) => {
  const { username, password } = req.body;
  // fetchUser()

  UserPass = [];
  const queryApi = new InfluxDB({ url, token }).getQueryApi(org);
  queryApi.queryRows(query3, {
    next(row, tableMeta) {
      const o = tableMeta.toObject(row);
      UserPass.push(o._value);
    },
    complete() {
      UserPass.forEach(printingVolume);

      console.log("[" + username.toLowerCase() + password.toLowerCase() + "]");

      if (
        UserPass.includes(
          "[" + username.toLowerCase() + ":" + password.toLowerCase() + "]"
        )
      ) {
        console.log("valid");
        // window.navigate("Noice")
        // res.redirect('/Noicedata');
        openwin("http://" + req.headers["host"] + "/NoiceData.html", "_self");
        console.log(
          "http://" + req.headers["host"] + "/NoiceData.html",
          "_self"
        );
        return res.redirect("/NoiceData");

        // window.replace("http://" + req.headers['host'] + '/NoiceData.html')

        // res.writeHead(301, { "Location": "http://" + req.headers['host'] + '/NoiceData.html' });
        // return res.end()

        // res.json("CredentialsAreValid")

        // return res.end();

        // res.json("CredentialsAreValid");
        // res.json(data[0]);
        // res.sendFile(path.join(intialPath, "NoiceData.html"));
      } else {
        console.log("Invalid");
        res.json("email or password is incorrect");
      }
    },
    error(error) {
      console.log("QUERY FAILED", error);
    },
  });
});

app.listen(port, (req, res) => {
  console.log("listening on port 3030......");
});
