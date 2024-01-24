import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'https://localhost:3004';  // Replace with your server URL
const AUTH_URL = `${BASE_URL}/login`;
const MENUS_URL = `${BASE_URL}/menu`;
const FORMS_URL = `${BASE_URL}/form`;  // Corrected the URL

const App = () => {
  const [username, setUsername] = useState('');  // Add this line
  const [password, setPassword] = useState('');  // Add this line
  const [menu, setMenu] = useState([]);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [taskID, setTaskID] = useState(null);
  const [taskStatus, setTaskStatus] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    axios.get(MENUS_URL)
      .then(response => {
        setMenu(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setError('Failed to fetch menu');
        setLoading(false);
      });
  }, []);

  const buildForm = async (slug) => {
    setLoading(true);
    try {
      const response = await axios.get(`${FORMS_URL}/${slug}`);
      setForm(response.data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError('Failed to fetch form');
      setLoading(false);
    }
  };

  const handleLogin = async (event) => {  // Add this function
    event.preventDefault();
    try {
      const response = await axios.post(AUTH_URL, { username, password });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    try {
      const response = await axios.post(AUTH_URL, formData);
      setTaskID(response.data.task_id);
      setTaskStatus(response.data.status);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {/* Add a login form */}
      <form onSubmit={handleLogin}>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
      {loading ? (
        <div>Loading...</div>  // Replace this with your loading spinner
      ) : (
        <div>
          {/* Render the menu */}
          {menu.map((item, index) => (
            <div key={index}>
              <h2>{item.title}</h2>
              {item.child.map((child, index) => (
                <div key={index}>
                  <h3>{child.title}</h3>
                  {child.generator.map((generator, index) => (
                    <button key={index} onClick={() => buildForm(generator.slug)}>
                      {generator.name}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          ))}

          {/* Render the form */}
          {form && (
            <form onSubmit={handleSubmit}>
              {form.steps.map((step, index) => (
                <fieldset key={index}>
                  <legend>{step.name}</legend>
                  {step.fields.map((field, index) => (
                    <div key={index}>
                      <label>{field.input_label}</label>
                      <input
                        type={field.type}
                        name={field.input_name}
                        placeholder={field.input_placeholder}
                        required={field.required}
                        pattern={field.regular_expression}
                      />
                    </div>
                  ))}
                </fieldset>
              ))}
              <button type="submit">Submit</button>
            </form>
          )}

          {/* Render the task status */}
          {taskStatus && (
            <div>
              <p>Task status: {taskStatus}</p>
              {taskStatus === 'end' && (
                <div>
                  <h2>COMPLETED</h2>
                  <img src={imageURL} alt="Preview" style={{ width: '50%' }} />
                  <a href={imageURL} download>Download</a>
                  <button onClick={() => setTaskStatus(null)}>Close</button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default App;
