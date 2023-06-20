const express = require('express');
const app = express();
app.use(express.json());

// Sample contacts data
let contacts = [
  { id: 1, name: 'John Doe', email: 'johndoe@example.com' },
  { id: 2, name: 'Jane Smith', email: 'janesmith@example.com' },
  { id: 3, name: 'Michael Johnson', email: 'michaeljohnson@example.com' },
  { id: 4, name: 'Emily Davis', email: 'emilydavis@example.com' },
  { id: 5, name: 'Robert Wilson', email: 'robertwilson@example.com' },
  { id: 6, name: 'Olivia Thompson', email: 'oliviathompson@example.com' },
  { id: 7, name: 'William Clark', email: 'williamclark@example.com' },
  { id: 8, name: 'Sophia Lewis', email: 'sophialewis@example.com' },
  { id: 9, name: 'James Rodriguez', email: 'jamesrodriguez@example.com' },
  { id: 10, name: 'Ava Turner', email: 'avaturner@example.com' }
];

// Sample messages data
let messages = [
  { id: 1, sender: 'John Doe', recipient: 'Jane Smith', content: 'Hello Jane!' },
  { id: 2, sender: 'Jane Smith', recipient: 'John Doe', content: 'Hi John! How are you?' },
  { id: 3, sender: 'Michael Johnson', recipient: 'Emily Davis', content: 'Hey Emily, long time no see!' },
  { id: 4, sender: 'Emily Davis', recipient: 'Michael Johnson', content: 'Yeah, it has been a while. How have you been?' },
  { id: 5, sender: 'Robert Wilson', recipient: 'Olivia Thompson', content: 'Hi Olivia, just wanted to check in on you.' },
  { id: 6, sender: 'Olivia Thompson', recipient: 'Robert Wilson', content: 'Thanks for reaching out, Robert. I am doing well.' },
  { id: 7, sender: 'William Clark', recipient: 'Sophia Lewis', content: 'Sophia, can we meet tomorrow to discuss the project?' },
  { id: 8, sender: 'Sophia Lewis', recipient: 'William Clark', content: 'Sure, let us meet at 2 PM in the conference room.' },
  { id: 9, sender: 'James Rodriguez', recipient: 'Ava Turner', content: 'Ava, have you seen the latest movie? It\'s amazing!' },
  { id: 10, sender: 'Ava Turner', recipient: 'James Rodriguez', content: 'No, I haven\'t. I need to watch it soon!' }
];

// Sample favorites data
let favorites = [
  { contactId: 1, name: 'John Doe' },
  { contactId: 3, name: 'Michael Johnson' },
  { contactId: 7, name: 'William Clark' }
];

const { v4: uuidv4 } = require('uuid');

function generateUniqueId() {
  return uuidv4();
}

// Route handler for the root path ("/")
app.get('/', (req, res) => {
  res.send('Welcome to Simple Phone App!');
});

// GET all messages
app.get('/messages', (req, res) => {
  res.json({ messages });
});

// GET a single message
app.get('/messages/:id', (req, res) => {
  const messageId = parseInt(req.params.id);
  const message = messages.find((msg) => msg.id === messageId);

  if (message) {
    res.json({ message });
  } else {
    res.status(404).json({ message: 'Message not found' });
  }
});


// GET all messages sent by a specific user
app.get('/messages/sender/:name', (req, res) => {
  const senderName = req.params.name;
  const senderMessages = messages.filter(message => message.sender === senderName);
  if (senderMessages.length > 0) {
    res.json({ messages: senderMessages });
  } else {
    res.status(404).json({ message: 'No messages found for the sender' });
  }
});

// GET all messages received by a specific user
app.get('/messages/recipient/:name', (req, res) => {
  const recipientName = req.params.name;
  const recipientMessages = messages.filter(message => message.recipient === recipientName);
  if (recipientMessages.length > 0) {
    res.json({ messages: recipientMessages });
  } else {
    res.status(404).json({ message: 'No messages found for the recipient' });
  }
});

// POST a new message
app.post('/messages', (req, res) => {
  const { sender, recipient, message } = req.body;
  const newMessage = {
    id: generateUniqueId(), // Assuming you have a function to generate unique IDs
    sender,
    recipient,
    message
  };

  messages.push(newMessage);

  res.status(201).json({ message: 'Message created successfully', newMessage });
});

// POST a message to a user
app.post('/contacts/:id/messages', (req, res) => {
  const contactId = parseInt(req.params.id);
  const { message } = req.body;
  const contactIndex = contacts.findIndex(contact => contact.id === contactId);
  if (contactIndex !== -1) {
    contacts[contactIndex].messages.push(message);
    res.json({ message: 'Message sent successfully' });
  } else {
    res.status(404).json({ message: 'Contact not found' });
  }
});

//==========================CONTACTS============================//

// GET all contacts
app.get('/contacts', (req, res) => {
  res.json({ contacts });
});

// GET a specific contact
app.get('/contacts/:id', (req, res) => {
  const contactId = parseInt(req.params.id);
  const contact = contacts.find(contact => contact.id === contactId);
  if (contact) {
    res.json({ contact });
  } else {
    res.status(404).json({ message: 'Contact not found' });
  }
});

// POST a new contact
app.post('/contacts', (req, res) => {
  const { name, email } = req.body;
  const newContact = { id: contacts.length + 1, name, email };
  contacts.push(newContact);
  res.status(201).json({ contact: newContact });
});

// PUT (update) an existing contact
app.put('/contacts/:id', (req, res) => {
  const contactId = parseInt(req.params.id);
  const { name, email } = req.body;
  const contactIndex = contacts.findIndex(contact => contact.id === contactId);
  if (contactIndex !== -1) {
    contacts[contactIndex].name = name;
    contacts[contactIndex].email = email;
    res.json({ contact: contacts[contactIndex] });
  } else {
    res.status(404).json({ message: 'Contact not found' });
  }
});

// PATCH (update) an existing contact
app.patch('/contacts/:id', (req, res) => {
  const contactId = parseInt(req.params.id);
  const { name, email } = req.body;
  const contactIndex = contacts.findIndex(contact => contact.id === contactId);
  if (contactIndex !== -1) {
    if (name) {
      contacts[contactIndex].name = name;
    }
    if (email) {
      contacts[contactIndex].email = email;
    }
    res.json({ contact: contacts[contactIndex] });
  } else {
    res.status(404).json({ message: 'Contact not found' });
  }
});

// DELETE a message
app.delete('/messages/:id', (req, res) => {
  const messageId = parseInt(req.params.id);
  
  // Find the index of the message with the given ID
  const messageIndex = messages.findIndex(message => message.id === messageId);
  
  if (messageIndex !== -1) {
    // Remove the message from the messages array
    messages.splice(messageIndex, 1);
    res.json({ message: 'Message deleted successfully' });
  } else {
    res.status(404).json({ message: 'Message not found' });
  }
});


// DELETE a contact
app.delete('/contacts/:id', (req, res) => {
  const contactId = parseInt(req.params.id);
  const contactIndex = contacts.findIndex(contact => contact.id === contactId);
  if (contactIndex !== -1) {
    contacts.splice(contactIndex, 1);
    res.json({ message: 'Contact deleted successfully' });
  } else {
    res.status(404).json({ message: 'Contact not found' });
  }
});

//==========================FAVORITES============================//

// GET favorites
app.get('/favorites', (req, res) => {
  res.json(favorites);
});

// GET favorite by ID
app.get('/favorites/:contactId', (req, res) => {
  const contactId = parseInt(req.params.contactId);
  const favorite = favorites.find(favorite => favorite.contactId === contactId);

  if (favorite) {
    res.json(favorite);
  } else {
    res.status(404).json({ message: 'Favorite not found' });
  }
});

// GET favorite by name
app.get('/favorites/name/:name', (req, res) => {
  const name = req.params.name;
  const favorite = favorites.find(favorite => favorite.name === name);

  if (favorite) {
    res.json(favorite);
  } else {
    res.status(404).json({ message: 'Favorite not found' });
  }
});

// POST favorite (add contact to favorites)
app.post('/favorites', (req, res) => {
  const { contactId, name } = req.body;
  const favoriteContact = { contactId, name };

  favorites.push(favoriteContact);

  res.status(201).json({ message: 'Favorite added successfully', favoriteContact });
});

// PATCH (update favorites name)
app.patch('/favorites/:contactId', (req, res) => {
  const contactId = parseInt(req.params.contactId);
  const { name } = req.body;
  const favoriteContact = favorites.find(favorite => favorite.contactId === contactId);

  if (favoriteContact) {
    favoriteContact.name = name;
    res.json({ message: 'Favorite name updated successfully', favoriteContact });
  } else {
    res.status(404).json({ message: 'Favorite not found' });
  }
});

// PUT (replace favorite)
app.put('/favorites/:contactId', (req, res) => {
  const contactId = parseInt(req.params.contactId);
  const { name } = req.body;
  const favoriteIndex = favorites.findIndex(favorite => favorite.contactId === contactId);

  if (favoriteIndex !== -1) {
    favorites[favoriteIndex] = { contactId, name };
    res.json({ message: 'Favorite replaced successfully', favorite: favorites[favoriteIndex] });
  } else {
    res.status(404).json({ message: 'Favorite not found' });
  }
});

// DELETE favorite
app.delete('/favorites/:contactId', (req, res) => {
  const contactId = parseInt(req.params.contactId);
  const favoriteIndex = favorites.findIndex(favorite => favorite.contactId === contactId);

  if (favoriteIndex !== -1) {
    favorites.splice(favoriteIndex, 1);
    res.json({ message: 'Favorite deleted successfully' });
  } else {
    res.status(404).json({ message: 'Favorite not found' });
  }
});

// Starting the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});