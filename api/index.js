const express = require('express');
const app = express();
const auth = require('./controller/authcontroller');
const user=require('./controller/userController');
app.use(express.json());

app.use('/api/auth', auth);
app.use('/api/user', user);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});