// requiring package
let formidable = require("formidable");
let path = require("path");
let fs = require("fs-extra");
let rootDir = require("../utility/root");
let bcrypt = require("bcrypt");
let crypto = require("crypto");
let envVariables = require("../config/env");

// Importing Models
let User = require("../model/user");

// exporting functions
exports.getLogin = async (req, res, next) => {
  if (req.session.isLoggedIn) {
    let shortName = req.session.user.userShortName;
    let user = await User.findOne({ userShortName: shortName });
    req.user = user;
    req.session.user = user;
    res.redirect("admin/dashboard");
  } else {
    res.render("auth/login", {
      title: "Login",
    });
  }
};
exports.getRegister = (req, res, next) => {
  res.render("auth/register", {
    title: "Register",
  });
};
exports.postRegister = (req, res, next) => {
  let userShortName = req.params.shortName;
  User.findOne({ userShortName: userShortName })
    .then((user) => {
      if (user) {
        throw new Error("User Already Registered");
      } else {
        let form = new formidable.IncomingForm({
          multiples: true,
          keepExtensions: true,
        });
        return new Promise((resolve, reject) => {
          form.parse(req, (formidablErr, fields, files) => {
            if (formidablErr) {
              reject(`File Upload Error: ${formidablErr}`);
            } else {
              let userName = fields.userName[0];
              let userShortName = fields.shortName[0];
              let userEmail = fields.email[0];
              let password = fields.password[0];
              let userMobileNumber = fields.mobile[0];
              let userProfilePicturePath = files.userProPic[0].filepath;
              let userProfilePictureName = files.userProPic[0].originalFilename;
              resolve({
                userName: userName,
                userShortName: userShortName,
                userEmail: userEmail,
                password: password,
                userMobileNumber: userMobileNumber,
                userProfilePicturePath: userProfilePicturePath,
                userProfilePictureName: userProfilePictureName,
              });
            }
          });
        });
      }
    })
    .then(
      ({
        userName,
        userShortName,
        userEmail,
        password,
        userMobileNumber,
        userProfilePicturePath,
        userProfilePictureName,
      }) => {
        let tempPath = userProfilePicturePath;
        let uploadDirPath = path.join(
          rootDir,
          "public",
          "upload",
          "user",
          `${userShortName}`,
          `${userProfilePictureName}`
        );
        return fs
          .ensureDir(path.dirname(uploadDirPath))
          .then(() => {
            return fs.rename(tempPath, uploadDirPath);
          })
          .then(() => {
            return {
              userName: userName,
              userShortName: userShortName,
              userEmail: userEmail,
              password: password,
              userMobileNumber: userMobileNumber,
              userProfilePicture: userProfilePictureName,
            };
          });
      }
    )
    .then((userData) => {
      let user = new User(userData);
      return user
        .save()
        .then((userSaved) => {
          res.send(`Registration Successfull`);
        })
        .catch((useSavedError) => {
          throw new Error(`User Registration Error: ${useSavedError.message}`);
        });
    })
    .catch((registrationError) => {
      console.log(`Registration Error: ${registrationError.message}`);
      res.send(`Registration Error: ${registrationError.message}`);
    });
};
exports.postLogin = (req, res, next) => {
  let userShortName = req.body.userShortName;
  let password = req.body.password;
  User.findOne({ userShortName: userShortName })
    .then((user) => {
      if (!user) {
        throw new Error("User not found");
      } else {
        return user;
      }
    })
    .then((user) => {
      let hashedPassword = user.password;
      return new Promise((resolve, reject) => {
        bcrypt.compare(password, hashedPassword, (bcHashErr, bcRes) => {
          if (bcHashErr) {
            reject(`Encryption Error: ${bcHashErr}`);
          } else {
            resolve({ user, bcRes });
          }
        });
      });
    })
    .then(({ user, bcRes }) => {
      if (!bcRes) {
        throw new Error("Short Name And Password Doesn't Matched");
      } else {
        return user;
      }
    })
    .then((user) => {
      req.user = user;
      req.session.user = user;
      req.session.isLoggedIn = true;
      res.send("Success");
    })
    .catch((loginError) => {
      res.send(`Login Error: ${loginError.message}`);
    });
};
