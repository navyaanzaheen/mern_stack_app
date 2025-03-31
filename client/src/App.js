import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [previousUsers, setPreviousUsers] = useState([]);
  const [formErrors, setFormErrors] = useState({ username: '', password: '' });

  const handleForm = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });

    // Clear the error for the changed input field.
    setFormErrors({ ...formErrors, [event.target.name]: '' });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let errors = { username: '', password: '' };
    let hasErrors = false;

    if (!form.username.trim()) {
      errors.username = 'Username is required';
      hasErrors = true;
    }
    if (!form.password.trim()) {
      errors.password = 'Password is required';
      hasErrors = true;
    }

    if (hasErrors) {
      setFormErrors(errors);
      return;
    } else {
      setFormErrors({ username: '', password: '' }); // Clear errors on success.
    }

    try {
      const response = await fetch("http://localhost:8080/demo", {
        method: 'POST',
        body: JSON.stringify(form),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
      alert('Data submitted successfully!');
      setForm({ username: '', password: '' });
      setShowUsers(false) //hide table after submit
    } catch (error) {
      console.error("Error submitting form", error);
    }
  };

  const getUsers = async () => {
    setLoading(true);
    setShowUsers(true); // Show table when "Get Data" is clicked.

    try {
      const response = await fetch("http://localhost:8080/demo", {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (JSON.stringify(data) !== JSON.stringify(users)) {
        setPreviousUsers(users);
        setUsers(data);
      }
    } catch (error) {
      console.error("Error Fetching Data", error);
      setShowUsers(true);
      setUsers(previousUsers);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {}, []);

  const handleButtonClick = () => {
    getUsers();
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/demo/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      if (responseData && responseData.message) {
        console.log(responseData.message);
        alert(responseData.message);
      } else {
        console.log("Data deleted successfully (no explicit message from server).");
        alert("Data deleted successfully.");
      }
      getUsers();
    } catch (error) {
      console.error("Error deleting user", error);
      alert("Error deleting user. Please try again.");
    }
  };

  return (
    <>
      <h1 className='text-center mb-5'>Form</h1>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Username"
            aria-label="Username"
            aria-describedby="addon-wrapping"
            name='username'
            onChange={handleForm}
            value={form.username}
          />
        </div>

        <div className="input-group mt-3">
          <input
            type="text"
            className="form-control"
            placeholder="Password"
            aria-label="Password"
            aria-describedby="addon-wrapping"
            name='password'
            onChange={handleForm}
            value={form.password}
          />
        </div>

        <div className="errors">
          {formErrors.username && <p className="text-danger">{formErrors.username}</p>}
          {formErrors.password && <p className="text-danger">{formErrors.password}</p>}
        </div>

        <div className="button mt-3 text-center">
          <input type="submit" className="btn btn-primary" />
          <button className="btn btn-primary ms-3" onClick={handleButtonClick} disabled={loading}>
            {loading ? "Loading..." : "Get Data"}
          </button>
        </div>
      </form>

      <div className='mt-3'>
        {loading && <p>Loading data...</p>}
        {showUsers && (
          <table className="table border border-3">
            <thead>
              <tr>
                <th>Username</th>
                <th>Password</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(users) &&
                users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.username}</td>
                    <td>{user.password}</td>
                    <td>
                      <button className="btn btn-danger" onClick={() => handleDelete(user._id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default App;