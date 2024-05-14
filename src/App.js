import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { SliderPicker } from 'react-color';
import OpenAI from 'openai';

import './App.css';

const openai = new OpenAI({
  apiKey: process.env.API_KEY,
  dangerouslyAllowBrowser: true,
});

function App() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color1, setColor1] = useState('');
  const [color2, setColor2] = useState('');
  const [color3, setColor3] = useState('');
  const [icon, setIcon] = useState('');
  const [chatOutput1, setChatOutput1] = useState('');
  const [chatOutput2, setChatOutput2] = useState('');
  const [chatOutput3, setChatOutput3] = useState('');
  const [image_url, setImage_url] = useState('https://via.placeholder.com/300');
  async function sendMessage() {
    setChatOutput1('Loading...');
    setChatOutput2('Loading...');
    setChatOutput3('Loading...');
    const suggestions = await openai.chat.completions.create({
      messages: [
        { role: 'user', content: `Company name: ${name}` },
        { role: 'user', content: `Description: ${description}` },
        { role: 'user', content: `Color 1: ${color1}` },
        { role: 'user', content: `Color 2: ${color2}` },
        { role: 'user', content: `Color 3: ${color3}` },
        { role: 'user', content: `Icon: ${icon}` },
        { role: 'user', content: `Max 20 char for one suggestion and make 4 of them each is in new line and starts with a number sequence.` },
        { role: 'user', content: 'From the given details make suggestions for extra elements in the logo. Like extra or different icons or ideas but not related to colors or business name.' },
      ],
      model: 'gpt-3.5-turbo',
    });
    const aboutColors = await openai.chat.completions.create({
      messages: [
        { role: 'user', content: `Company name: ${name}` },
        { role: 'user', content: `Description: ${description}` },
        { role: 'user', content: `Color 1: ${color1}` },
        { role: 'user', content: `Color 2: ${color2}` },
        { role: 'user', content: `Color 3: ${color3}` },
        { role: 'user', content: `Icon: ${icon}` },
        { role: 'user', content: `Max 50 char for one suggestion and make 4 of them each is in new line and starts with a number sequence.` },
        { role: 'user', content: 'Suggest some colors which would be better to use for the logo or respond which given color is suitable' },
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0.8
    });
    const betterName = await openai.chat.completions.create({
      messages: [
        { role: 'user', content: `Company name: ${name}` },
        { role: 'user', content: `Description: ${description}` },
        { role: 'user', content: `Color 1: ${color1}` },
        { role: 'user', content: `Color 2: ${color2}` },
        { role: 'user', content: `Color 3: ${color3}` },
        { role: 'user', content: `Icon: ${icon}` },
        { role: 'user', content: `Max 50 char for one suggestion and make 4 of them each is in new line and starts with a number sequence.` },
        { role: 'user', content: 'Suggest better name ideas related to the given one.' },
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0.8
    });
    const imageResponse = await openai.images.generate({
      model: "dall-e-3",
      prompt: "A logo for a company named " + name + " with the description " + description + ". The colors are " + color1 + ", " + color2 + ", " + color3 + " and the icon is " + icon + ".",
      n: 1,
      size: "1024x1024",
    });
    setImage_url(imageResponse.data[0].url);

    const response1 = suggestions.choices[0].message.content;
    const list1= response1.match(/(?<=\d\.\s).*?(?=\s\d\.\s|$)/g);
    
    const response2 = aboutColors.choices[0].message.content;
    const list2 = response2.match(/(?<=\d\.\s).*?(?=\s\d\.\s|$)/g);
    
    const response3 = betterName.choices[0].message.content;
    const list3 = response3.match(/(?<=\d\.\s).*?(?=\s\d\.\s|$)/g);
    
    setChatOutput1(list1);
    setChatOutput2(list2);
    setChatOutput3(list3);
  }

  return (
    <div id="chat-window">
      <div className="main-title">INSPIRATION FOR LOGO IDEAS...</div>
      <div className='output-container'>
        <p id="chat-output">
          <h1>Element suggestions:</h1>
          <br/>
          {chatOutput1 === 'Loading...' ? chatOutput1 : "1. " + chatOutput1[0]}
          <br/>
          {chatOutput1 === 'Loading...' ? "" : "2. "  + chatOutput1[1]}
          <br/>
          {chatOutput1 === 'Loading...' ? "" : "3. " + chatOutput1[2]}
          <br/>
          {chatOutput1 === 'Loading...' ? "" : "4. " + chatOutput1[3]}
        </p>
        <p id="chat-output">
          <h1>Color suggestions:</h1>
          <br/>
          {chatOutput2 === 'Loading...' ? chatOutput2 : "1. " + chatOutput2[0]}
          <br/>
          {chatOutput2 === 'Loading...' ? "" : "2. "  + chatOutput2[1]}
          <br/>
          {chatOutput2 === 'Loading...' ? "" : "3. " + chatOutput2[2]}
          <br/>
          {chatOutput2 === 'Loading...' ? "" : "4. " + chatOutput2[3]}
        </p>
        <p id="chat-output">
          <h1>Name suggestions:</h1>
          <br/>
          {chatOutput3 === 'Loading...' ? chatOutput3 : "1. " + chatOutput3[0]}
          <br/>
          {chatOutput3 === 'Loading...' ? "" : "2. "  + chatOutput3[1]}
          <br/>
          {chatOutput3 === 'Loading...' ? "" : "3. " + chatOutput3[2]}
          <br/>
          {chatOutput3 === 'Loading...' ? "" : "4. " + chatOutput3[3]}
        </p>
      </div>
      <div id="chat-form">
        <Form>
          <img src={image_url} alt="Logo" height={256} width={256}/>
          <Form.Group controlId="name-input">
            <h1>Enter company name:</h1>
            <Form.Control
              type="text"
              placeholder="Company name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <h1>Enter company description:</h1>
            <Form.Control
              type="text"
              placeholder="Short description of the company"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <h1>Enter icon for the logo:</h1>
            <Form.Control
              type="text"
              placeholder="Icon for the logo"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
            />
            <Button variant="primary" onClick={sendMessage}>
            SUBMIT
          </Button>
          </Form.Group>

          <Form.Group controlId="color-input">
            <Form.Control
              type="text"
              placeholder="Enter color 1"
              value={color1}
              onChange={(e) => setColor1(e.target.value)}
            />
            <SliderPicker color={color1} onChange={(color) => setColor1(color.hex)} />
            <Form.Control
              type="text"
              placeholder="Enter color 2"
              value={color2}
              onChange={(e) => setColor2(e.target.value)}
            />
            <SliderPicker color={color2} onChange={(color) => setColor2(color.hex)} />
            <Form.Control
              type="text"
              placeholder="Enter color 3"
              value={color3}
              onChange={(e) => setColor3(e.target.value)}
            />
            <SliderPicker color={color3} onChange={(color) => setColor3(color.hex)} />
          </Form.Group>
        </Form>
      </div>
    </div>
  );
}

export default App;
