import { useState, useEffect } from "react";
import "./Admin.css";
import "./App.css";
import "./Misc.css";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newUser, setNewUser] = useState({ username: "", email: "", first_name: "", last_name: "" });

  useEffect(() => {
    // Fetch users data
    fetch("/admin/users")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load user data");
        return res.json();
      })
      .then((data) => {
        setUsers(Array.isArray(data) ? data : data.users || []);
      })
      .catch((err) => setError(err.message));

    // Fetch courses data
    fetch("/admin/courses")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load course data");
        return res.json();
      })
      .then((data) => {
        setCourses(Array.isArray(data) ? data : data.courses || []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const handleAddUser = () => {
    fetch("/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser),
    })
      .then((res) => res.json())
      .then((data) => setUsers([...users, data]))
      .catch((err) => setError("Failed to add user"));
  };

  const handleDeleteUser = (username) => {
    fetch(`/admin/users/${username}`, { method: "DELETE" })
      .then(() => setUsers(users.filter((user) => user.username !== username)))
      .catch((err) => setError("Failed to delete user"));
  };

  if (isLoading) return <div className="loading">Loading data...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-container">
      <div className="admin-section">
        <h2>Users</h2>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Registered Courses</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={index}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.first_name}</td>
                  <td>{user.last_name}</td>
                  <td>{user.registered_courses}</td>
                  <td>
                    <button onClick={() => handleDeleteUser(user.username)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="6">No user data available</td></tr>
            )}
          </tbody>
        </table>
        <h3>Add New User</h3>
        <input placeholder="Username" onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} />
        <input placeholder="Email" onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
        <input placeholder="First Name" onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })} />
        <input placeholder="Last Name" onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })} />
        <button onClick={handleAddUser}>Add User</button>
      </div>

      <div className="admin-section">
        <h2>Courses</h2>
        <table>
          <thead>
            <tr>
              <th>String ID</th>
              <th>Course Title</th>
              <th>Description</th>
              <th>Schedule</th>
              <th>Classroom Number</th>
              <th>Maximum Capacity</th>
              <th>Credit Hours</th>
              <th>Tuition Cost</th>
            </tr>
          </thead>
          <tbody>
            {courses.length > 0 ? (
              courses.map((course, index) => (
                <tr key={index}>
                  <td>{course.string_id}</td>
                  <td>{course.title}</td>
                  <td>{course.description}</td>
                  <td>{course.schedule}</td>
                  <td>{course.classroom_number}</td>
                  <td>{course.maximum_capacity}</td>
                  <td>{course.credit_hours}</td>
                  <td>{course.tuition_cost}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="8">No course data available</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
