const express = require('express');
const cors = require('cors'); // Import CORS middleware
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;


// Use CORS middleware
app.use(cors());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Other middleware and route definitions
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
const USERS_FILE = path.join(__dirname, 'users.json');
const stages = [
  { stageNumber: 1, story: 'Haha! You have been tricked by us, the hackers. To restart the power plant, you must get past the intense security measures set by us to keep you out. These measures can range from easily encrypted codes, to extremely hard maths. \n \n You must figure out the first password by looking around and trying to find a paper with Rome and an E that looks like a 3.', passcode: 'eigthissecond' },
  { stageNumber: 2, story: 'Well, wow, I guess you aren’t as bad as I thought at ciphers. Here\'s a clue: You must look around for a paper, here you will see that 8 is used for the second part. Decode this: 42/34/44/11/44/24/33/22', passcode: 'sixthisthird' },
  { stageNumber: 3, story: 'Wow, you\'re doing pretty good but you probably won\’t get past this one. Just look for a note like the one from the first part (get off of the rails!), and the cipher will be revealed to you. Decode this: fut sfutorhi orh', passcode: 'fourth is fourth' },
  { stageNumber: 4, story: 'Alright, you have to stop cracking our codes. How did you even get here that fast! I can’t let you solve this one in time.  Decode this: xryriyxsl (keyword: poke)', passcode: 'idontknow' },
  { stageNumber: 5, story: 'You got here! Wha-wha-what, impossible, but you\'ll never be able to make it past the final defense. Enter this URL into the your browser(keep this tab open or you will lose your progress): \n https://bit.ly/jumpy', passcode: 'nothing'}
];

function readUsers() {
  if (!fs.existsSync(USERS_FILE)) {
    return [];
  }
  const data = fs.readFileSync(USERS_FILE, 'utf8');
  try {
    return JSON.parse(data);
  } catch (error) {
    console.error('Error parsing users.json:', error);
    return [];
  }
}

function writeUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf8');
}

app.post('/start', (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send('Name is required');
    }

    const users = readUsers();
    const user = { name, stage: 1, messages: [] };
    users.push(user);
    writeUsers(users);
    res.send({ story: stages[0].story });
  } catch (error) {
    console.error('Error in /start:', error);
    res.status(500).send('Server error');
  }
});

app.post('/next', (req, res) => {
  try {
    const { name, passcode } = req.body;
    if (!name || !passcode) {
      return res.status(400).send('Name and passcode are required');
    }

    const users = readUsers();
    const user = users.find(user => user.name === name);
    if (!user) {
      return res.status(404).send('User not found');
    }

    const currentStage = stages[user.stage - 1];
    if (currentStage.passcode === passcode) {
      user.stage++;
      writeUsers(users);
      const nextStage = stages[user.stage - 1];
      res.send({ success: true, story: nextStage ? nextStage.story : 'YAY!! You won and saved everyone! You and your coworkers have definitely bonded over this experience and are definitely ready for the next time the power plant gets hacked - Wait what!? \n Your boss calls you and tells you that for your hard work, you have earned a prize! Type this link into the address bar to claim your prize: \n https://bit.ly/goprize' });
    } else {
      res.send({ success: false, message: 'Incorrect password' });
    }
  } catch (error) {
    console.error('Error in /next:', error);
    res.status(500).send('Server error');
  }
});


app.get('/users', (req, res) => {
  try {
    const users = readUsers();
    res.send(users);
  } catch (error) {
    console.error('Error in /users:', error);
    res.status(500).send('Server error');
  }
});

app.post('/send-message', (req, res) => {
  try {
    const { name, message } = req.body;
    if (!name || !message) {
      return res.status(400).send('Name and message are required');
    }

    const users = readUsers();
    const user = users.find(user => user.name === name);
    if (!user) {
      return res.status(404).send('User not found');
    }

    user.messages.push(message);
    writeUsers(users);
    res.send(user);
  } catch (error) {
    console.error('Error in /send-message:', error);
    res.status(500).send('Server error');
  }
});

app.post('/kick', (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).send('Name is required');
    }

    let users = readUsers();
    users = users.filter(user => user.name !== name);
    writeUsers(users);
    res.send('User kicked');
  } catch (error) {
    console.error('Error in /kick:', error);
    res.status(500).send('Server error');
  }
});

app.get('/get-messages', (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).send('Name is required');
    }

    const users = readUsers();
    const user = users.find(user => user.name === name);
    if (!user) {
      return res.status(404).send('User not found');
    }

    res.send(user.messages);
  } catch (error) {
    console.error('Error in /get-messages:', error);
    res.status(500).send('Server error');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
