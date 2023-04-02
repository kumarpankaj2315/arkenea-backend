const express = require("express");
const router = express.Router();
const multer = require("multer");
const { success, error } = require("../response");

const FILE_TYOE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let isValid = FILE_TYOE_MAP[file.mimetype];
    let uploadError = new Error("Invalid Type");

    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, `./${process.env.USER_PROFILE_FOLDER}`);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYOE_MAP[file.mimetype];
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

const uploadOption = multer({ storage: storage });

const { User } = require("../models/user.model");

router.post("/create", uploadOption.single("image"), async (req, res) => {
  try {
    if (!req.file) return res.status(500).send("No image in the request");
    let filename = req.file.filename;
    let path = `${req.protocol}://${req.get("host")}/user/images`;
    let userDetails = new User(req.body);
    userDetails.image = `${path}/${filename}`;
    userDetails = await userDetails.save();
    res.status(201).json(success("OK", { data: userDetails }, res.statusCode));
  } catch (err) {
    console.log("error");
    res.status(500).json(error("Something went wrong", res.statusCode));
  }
});

router.put("/update/:id", uploadOption.single("image"), async (req, res) => {
  try {
    let filename;
    let path;
    let dataBody = req.body;
    console.log("request body", req.body);
    if (req.file && req.file.filename) {
      filename = req.file.filename;
      path = `${req.protocol}://${req.get("host")}/user/images`;
      dataBody.image = `${path}/${filename}`;
    }
    if (dataBody.images) {
      dataBody.images = dataBody.images.split(",");
    }
    const updateUser = await User.findByIdAndUpdate(req.params.id, dataBody);
    if (!updateUser) {
      res
        .status(500)
        .json(error("The user with given id was not found", res.statusCode));
    }
    res.status(200).json(success("OK", { data: updateUser }, res.statusCode));
  } catch (err) {
    console.log("error is", err);
    res.status(500).json(error(err.message, res.statusCode));
  }
});

router.get("/", async (req, res) => {
  try {
    const getUser = await User.find();
    if (getUser && getUser.length) {
      res.status(200).json(success("OK", { data: getUser }, res.statusCode));
    } else {
      res.status(200).json(success("OK", { data: [] }, res.statusCode));
    }
  } catch (err) {
    res.status(500).json(error(err.message, res.statusCode));
  }
});

router.get("/:id", async (req, res) => {
  try {
    const getUser = await User.findById(req.params.id);
    console.log("user data", getUser);
    if (getUser) {
      res.status(200).json(success("OK", { data: getUser }, res.statusCode));
    } else {
      res.status(400).json(error("No User found", res.statusCode));
    }
  } catch (err) {
    res.status(500).json(error(err.message, res.statusCode));
  }
});

router.delete("/:id", async (req, res) => {
  console.log("deleteing user");
  try {
    User.findByIdAndDelete(req.params.id)
      .then((deletedUser) => {
        if (!deletedUser) {
          return res
            .status(404)
            .json(error("User does not exist", res.statusCode));
        }
        res
          .status(200)
          .json(success("OK", { data: deletedUser }, res.statusCode));
      })
      .catch((err) => {
        res.status(404).json(error(err.message, res.statusCode));
      });
  } catch (err) {
    res.status(400).json(error(err.message, res.statusCode));
  }
});

module.exports = router;
