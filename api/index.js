const express = require('express');
const app = express();
const auth = require('./controller/authcontroller');
const user=require('./controller/userController');

// process.on('unhandledRejection', (reason, promise) => {
//   console.error('Unhandled Promise Rejection:', reason);
//   // You can add your own error handling logic here
//   // For example, you can log the error or gracefully exit the process
//   process.exit(1); // Terminate the Node.js process with a non-zero exit code
// });
app.use(express.json());

app.use('/api/auth', auth);
app.use('/api/user', user);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});