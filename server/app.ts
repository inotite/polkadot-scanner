import path from 'path';
import express from 'express';
import basicAuth from 'express-basic-auth';

const app = express();
const PORT = process.env.PORT || 8000;
const mockUsers = {
  'admin': 'password'
};

app.use(basicAuth({
  challenge: true,
  users: mockUsers,
}));
app.use(express.static(path.join(__dirname, '../build')));
app.use(express.static('public'));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
