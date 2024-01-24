import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BASE_URL = 'http://localhost:3004';  // Replace with your server URL
const AUTH_URL = `${BASE_URL}/login`;
const MENUS_URL = `${BASE_URL}/menu`;
const FORMS_URL = `${BASE_URL}/api/frontend/generator/`;


// Set axios defaults to include the headers for all requests
axios.defaults.headers.common = {
  "Accept": "application/json, text/plain",
  "Origin": "https://verif.tools",
  "Referer": "https://verif.tools/",
  "Authorization": "",
};

const App = () => {
  const [menu, setMenu] = useState([]);
  const [form, setForm] = useState(null);
  const [taskStatus, setTaskStatus] = useState(null);
  const [taskID, setTaskID] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    axios.get(MENUS_URL)
      .then(response => {
        setMenu(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  const buildForm = async (slug) => {
    try {
      const response = await axios.get(`${FORMS_URL}/${slug}`);
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
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
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
