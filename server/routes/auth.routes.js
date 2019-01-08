var express = require('express');
var bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models').User;
// var RoleSchemas = require('../schemas/role.js')



/**
 * register
 */
module.exports = {
    create: function create(req, res) {

        var obj = {};
        ['firstName', 'lastName', 'email', 'password', 'position', 'isAccepted', 'isRejected', 'userRole', 'rejectionNote', 'creationDate', 'tempPassword', 'createdAt', 'updatedAt']
            .forEach((element) => {
                obj[element] = req.body[element];
            });

        return User.create(obj)
            .then(user => {
                return res.status(201).send(user);
            })
            .catch(error => {
                    res.status(401).send(error);
                }
            );
    },

    login: function (req, res, next) {

        User.find({where: {email: req.body.email}})
            .then(user => {
                var temp = req.body.password == user.tempPassword
                if (!(bcrypt.compareSync(req.body.password, user.password) || temp || bcrypt.compareSync(req.body.password, user.tempPassword))) {
                    return res.status(401).send({
                        title: 'Login failed',
                        error: {message: 'Invalid user Email Address or Password.'}
                    });
                }

                if (!user.isAccepted) {
                    return res.status(401).send({
                        title: 'Login failed',
                        error: {message: 'Your account has not been approved, please wait for Administrator Approval.'}
                    });
                }

                // if user doesn't use temp password login, we need to clear temp password for the user.
                // This means user still remember her/his password
                if (!temp) {
                    user.tempPassword = "";
                    user.save();
                }

                var token = jwt.sign({user: user}, 'innovation', {expiresIn: 7200}); // token is good for 2 hours

                res.status(200).send({
                    message: 'Successfully logged in',
                    token: token,
                    firstName: user.firstName, // save name and agency to local browser storage
                    lastName: user.lastName,
                    email: user.email,
                    agency: user.agency,
                    position: user.position,
                    userRole: user.userRole,
                    id: user._id,
                    tempPassword: user.tempPassword
                });

            })
            .catch(err => {
                return res.status(401).send({
                    title: 'Unauthorized'
                });
            });
    },

    resetPassword: function (req, res, next) {
        var email = req.body.email;
        return User.findOne({where: {email: email}})
            .then(async user => {
                var temp = new Date().toLocaleDateString() + new Date().toLocaleTimeString() + 'SRTAI';
                temp = bcrypt.hashSync(temp, 10);
                if (user != null) {
                    // encrypt temp.
                    user.tempPassword = temp;
                    await user.save();
                }
                return res.status(200).send({
                    tempPassword: temp,
                    message: ' reset password request has been sent, please check on your email!'
                })

            })
            .catch((err) => {
                return res.status(500).send(err);
            });
    },

    tokenCheck: function (req, res, next) {
      var token = req.body.token;
      var isLogin = false;
      var isGSAAdmin = false;

      if (token == undefined) {
          return res.send(400);

      }

      return jwt.verify(token, 'innovation',
          function(err, decoded) {
            if (err) {
                isLogin = false;
            }
            else
            {
              var tokenInfo = jwt.decode(token);
              isLogin = true;
              if (tokenInfo.user)
              {
                isGSAAdmin = (tokenInfo.user.userRole == "Administrator" || tokenInfo.user.userRole == "SRT Program Manager ") && tokenInfo.user.agency.indexOf("General Services Administration") > -1;
              }
            }
            res.status(200).send({
                isLogin: isLogin,
                isGSAAdmin: isGSAAdmin
            });
          });
    },

}
//
// /**
//  * login
//  */
// router.post('/login', (req, res, next) => {
//   UserSchemas.findOne({email: req.body.email}, (err, user) => {
//     if (err) {
//       return res.status(500).json({
//         title: 'An error occurred',
//         error: err
//       });
//     }
//     if (!user) {
//       return res.status(401).json({
//         title: 'Login failed',
//         error: {message: 'Invalid user Email Address or Password.'}
//       });
//     }else{
//     var temp = req.body.password == user.tempPassword
//     if (!(bcrypt.compareSync(req.body.password, user.password) || temp)){
//       return res.status(401).json({
//         title: 'Login failed',
//         error: {message: 'Invalid user Email Address or Password.'}
//       });
//     }
//
//     // if (!user.isAccepted) {
//     //   return res.status(401).json({
//     //     title: 'Login failed',
//     //     error: {message: 'Your account has not been approved, please wait for Administrator Approval.'}
//     //   });
//     // }
//
//      // if user doesn't use temp password login, we need to clear temp password for the user.
//         // This means user still remember her/his password
//     if (!temp) {
//       user.tempPassword = "";
//       user.save(function (err, UserSchemas) { })
//     }
//
//     var token = jwt.sign({user: user}, 'innovation', {expiresIn: 7200}); // token is good for 2 hours
//
//     res.status(200).json({
//         message: 'Successfully logged in',
//         token: token,
//         firstName: user.firstName, // save name and agency to local browser storage
//         lastName: user.lastName,
//         email: user.email,
//         agency: user.agency,
//         position: user.position,
//         userRole: user.userRole,
//         id: user._id,
//         tempPassword: user.tempPassword
//
//     });
//   }
//   });
// });
//
//
// /**
//  * Reset.
//  */
// router.post('/resetPassword', function (req, res) {
//   var email = req.body.email;
//   UserSchemas.findOne({ email: email }, function (err, response) {
//     if (err) {
//     res.send(err)
//     }
//     // Check if user is already exist in the database
//     if (response) {
//       var temp = new Date().toLocaleDateString() + new Date().toLocaleTimeString() + 'SRTAI';
//       // encrypt temp.
//       temp = bcrypt.hashSync(temp, 10);
//       response.tempPassword = temp;
//       response.save(function (err, UserSchemas) {
//         if (err) {
//          res.send(err);
//         }
//         else {
//           res.json({message: ' reset password request has been sent, please check on your email!'})
//
//         }
//       })
//     }
//     else {
//       res.json({message: 'Reset failed, system can not recognize your email.'})
//
//     }
//   })
// });
//
//
// /**
//  * check if token is valid
//  */
// router.post('/tokenCheck', function(req, res) {
//   var token = req.body.token;
//   var isLogin = false;
//   var isGSAAdmin = false;
//   jwt.verify(token, 'innovation', function(err, decoded) {
//     if (err) {
//         isLogin = false;
//     }
//     else
//     {
//       var tokenInfo = jwt.decode(token);
//       isLogin = true;
//       if (tokenInfo.user)
//       {
//         isGSAAdmin = (tokenInfo.user.userRole == "Administrator" || tokenInfo.user.userRole == "SRT Program Manager ") && tokenInfo.user.agency.indexOf("General Services Administration") > -1;
//       }
//     }
//     res.status(200).json({
//         isLogin: isLogin,
//         isGSAAdmin: isGSAAdmin
//     });
//   });
// })
//
//
//
//
//
// module.exports = router;
//