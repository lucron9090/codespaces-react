import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'https://oldie.veriftools.ru';
const AUTH_URL = `${BASE_URL}/api/frontend/token/`;
const MENUS_URL = `${BASE_URL}/api/frontend/category/`;
const FORMS_URL = `${BASE_URL}/api/frontend/generator/`;
const GEN_URL = `${BASE_URL}/api/integration/generate/`;
const STATUS_URL = `${BASE_URL}/api/integration/generation-status/`;

// Set axios defaults to include the headers for all requests
axios.defaults.headers.common = {
  "Accept": "application/json, text/plain",
  "Authorization": "",
};


const App = () => {
  const [menu, setMenu] = useState([]);
  const [form, setForm] = useState(null);
  const [taskStatus, setTaskStatus] = useState(null);
  const [taskID, setTaskID] = useState(null);
  const [imageURL, setImageURL] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (taskID) {
        axios.get(`${STATUS_URL}/${taskID}`)
          .then(response => {
            setTaskStatus(response.data.task_status);
            if (response.data.task_status === 'end') {
              setImageURL(response.data.image_url);
              clearInterval(interval);
            }
          })
          .catch(error => console.error(error));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [taskID]);

  const buildForm = async (slug) => {
    try {
      const response = await axios.get(`${FORMS_URL}/${slug}`, { headers: HEADERS });
      setForm(response.data);

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
      console.log(response.data);
  
      // Extract the access token from the response
      const accessToken = response.data.access;
  
      // Append the access token to the headers
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  
    } catch (error) {
      console.error(error);
    }
  };



  // Fetch the menu when the component mounts
  useEffect(() => {
    axios.get(MENUS_URL)
      .then(response => setMenu(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
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
  );
};

export default App;