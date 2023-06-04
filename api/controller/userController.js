const admin = require('firebase-admin');
const express = require('express');
const router = express.Router();
var serviceAccount = require("../credentials.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

router.post('/add', async (req, res) => {
        const uid=req.body.uid;
        const user=req.body.user;
        console.log(uid);
        console.log(user);
        try {
            const userDoc = await admin.firestore().collection('user').doc(uid).get();
            if (userDoc.exists)
            {
                res.status(400).json({
                    code:"USER_RECORD_EXIST",
                    message:"This user cannot be created"

                })
            }
            else
            {
            await admin.firestore().collection(`user`).doc(uid).set(user);
            res.status(200).json({
              success:true
            })
            }
          } catch (error) {
              res.status(404).send({ code:error.code, message: error.message })
          }
  });
  router.put('/update-by-guid', async (req, res) => {
    const guid=req.body.guid;
    const user=req.body.user;

    try {
        const result = await admin.firestore().collection('user').where('guid',"==",guid).get();
        if (result.empty)
        {
            res.status(400).json({
                code:"USER_RECORD_DOES_NOT_EXIST",
                message:"No update is allowed"

            })
        }
        else
        {
            const documentId = result.docs[0].id;
        await admin.firestore().collection(`user`).doc(documentId).update(user);
        res.status(200).json({
          success:true
        })
        }
      } catch (error) {
          res.status(404).send({ code:error.code, message: error.message })
      }
});
router.put('/update-by-docId', async (req, res) => {
    const id=req.body.docId;
    const user=req.body.user;

    try {
        await admin.firestore().collection(`user`).doc(id).update(user);
        res.status(200).json({
          success:true
        })
      } catch (error) {
          res.status(404).send({  code:error.code, message: error.message })
      }
});
router.get('/get-all', async (req, res) => {

    try {
        const result = await admin.firestore().collection('user').get();
            var user=[];
             result.forEach((x)=>user.push(x.data()));
            res.status(200).json({
                user: user
            });

    } catch (error) {
        res.status(500).json({
            code:error.code, message: error.message
        });
    }
});
router.get('/get-by-docId/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const result = await admin.firestore().collection('user').doc(id).get();
        if (!result.exists) {
            res.status(404).json({
                code:'USER_NOT_FOUND',
                message: 'This document id cannot be found'
            });
        } else {
            const user = result.data();
            res.status(200).json({
                user: user
            });
        }
    } catch (error) {
        res.status(500).json({
            code:error.code, message: error.message
        });
    }
});

router.get('/get-by-guid/:guid', async (req, res) => {
    const guid = req.params.guid;

    try {
        const result =await admin.firestore().collection('user').where('guid',"==",guid).get();
        if (result.empty) {
            res.status(404).json({

                code:'USER_NOT_FOUND',
                message: 'The user guid cannot be found'
            });
        } else {
            const user = result.docs[0].data();
            res.status(200).json({
                user: user
            });
        }
    } catch (error) {
        res.status(500).json({
            code:error.code, message: error.message
        });
    }
});

  module.exports = router;