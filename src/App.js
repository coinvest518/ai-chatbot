import React, { useState } from 'react';
import { Container, TextField, Button, List, ListItem, ListItemText, Paper, Typography } from '@mui/material';
import axios from 'axios';

function App() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    const userMessage = { role: 'user', content: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');

    try {
      const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: "gpt-3.5-turbo",
        messages: [...messages, userMessage],
      }, {
        headers: {
          'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      const aiMessage = response.data.choices[0].message;
      setMessages((prevMessages) => [...prevMessages, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prevMessages) => [...prevMessages, { role: 'assistant', content: 'Sorry, I encountered an error.' }]);
    }
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '2rem' }}>
      <Paper elevation={3} style={{ padding: '2rem', backgroundColor: '#f0f4f8' }}>
        <Typography variant="h4" gutterBottom style={{ color: '#2c3e50', textAlign: 'center' }}>
          AI Chatbot
        </Typography>
        <List style={{ maxHeight: '400px', overflow: 'auto', marginBottom: '1rem' }}>
          {messages.map((message, index) => (
            <ListItem key={index} alignItems="flex-start" style={{ flexDirection: message.role === 'user' ? 'row-reverse' : 'row' }}>
              <Paper elevation={1} style={{ padding: '0.5rem 1rem', backgroundColor: message.role === 'user' ? '#3498db' : '#2ecc71', color: 'white', borderRadius: '20px' }}>
                <ListItemText primary={message.content} />
              </Paper>
            </ListItem>
          ))}
        </List>
        <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem' }}>
          <TextField
            fullWidth
            variant="outlined"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <Button type="submit" variant="contained" color="primary">
            Send
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default App;