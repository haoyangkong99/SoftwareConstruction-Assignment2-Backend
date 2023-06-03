const express = require('express');
const router = express.Router();
const firebase = require('firebase/app');
const {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
 } = require("firebase/auth");
const apiKey = "AIzaSyB2fLOHdom13E12VcaKM4aOBOZmer4npKI";
firebase.initializeApp({
  apiKey: apiKey,
});
const auth = getAuth();

router.post('/register', async (req, res) => {
  var email = req.body.email;
  var password = req.body.password;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      var userRecord = userCredential.user;
      res.status(200).json({
        uid: userRecord.uid,
      });
    }

    catch(error)  {
      if (error.code === 'auth/weak-password') {
        res.status(403).json({
          code: 'ERROR_SIGN_UP_EMAIL_PASSWORD',
          message: 'The password provided is too weak',
        });
      } else if (error.code === 'auth/email-already-in-use') {
        res.status(403).json({
          code: 'ERROR_SIGN_UP_EMAIL_PASSWORD',
          message: 'The account already exists for that email.',
        });
      } else {
        res.status(400).json({
          code: 'ERROR_SIGN_UP_EMAIL_PASSWORD',
          message: 'Error occurred',
        });
      }
    };
});

router.post('/login-email', async (req, res) => {
  var email = req.body.email;
  var password = req.body.password;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    var userRecord = userCredential.user;
    res.status(200).json({
      uid: userRecord.uid,
    });
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      res.status(403).json({
        code: 'ERROR_SIGN_IN_EMAIL_PASSWORD',
        message: 'No user found for that email.',
      });
    } else if (error.code === 'auth/wrong-password') {
      res.status(403).json({
        code: 'ERROR_SIGN_IN_EMAIL_PASSWORD',
        message: 'Wrong password',
      });
    } else {
      res.status(400).json({
        code: 'ERROR_SIGN_IN_EMAIL_PASSWORD',
        message: error.message,
      });
    }
  }
});

router.post('/reset', async (req, res) => {
  var email = req.body.email;

  try {
    await sendPasswordResetEmail(auth,email);
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    res.status(400).json({
      code: 'ERROR_RESET_PASSWORD',
      message: error.message,
    });
  }
});



module.exports = router;
