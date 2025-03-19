import { useState, useEffect } from "react";
import "./App.css";
import "./Misc.css";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newUser, setNewUser] = useState({ username: "", email: "", first_name: "", last_name: "", password: "" });
  const [newCourse, setNewCourse] = useState({ string_id: "", title: "", description: "", schedule: "", classroom_number: "", maximum_capacity: "", credit_hours: "", tuition_cost: "" });

  useEffect(() => {
    fetch("/admin/users")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load user data");
        return res.json();
      })
      .then((data) => {
        setUsers(Array.isArray(data) ? data : data.users || []);
      })
      .catch((err) => setError(err.message));

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
    fetch("/admin/createuser", {
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

  const handleAddCourse = () => {
    fetch("/admin/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCourse),
    })
      .then((res) => res.json())
      .then((data) => setCourses([...courses, data]))
      .catch((err) => setError("Failed to add course"));
  };

  const handleDeleteCourse = (stringId) => {
    fetch(`/admin/courses/${stringId}`, { method: "DELETE" })
      .then(() => setCourses(courses.filter((course) => course.string_id !== stringId)))
      .catch((err) => setError("Failed to delete course"));
  };

  const handleUpdateCourse = (stringId, updatedCourse) => {
    fetch(`/admin/courses/${stringId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedCourse),
    })
      .then((res) => res.json())
      .then((data) => setCourses(courses.map((course) => (course.string_id === stringId ? data : course))))
      .catch((err) => setError("Failed to update course"));
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
        <input placeholder="Password" onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
        <button onClick={handleAddUser}>Add User</button>
      </div>

      <div className="admin-section">
        <h2>Courses</h2>
        <table>
          <thead>
            <tr>
              <th>String ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Schedule</th>
              <th>Classroom Number</th>
              <th>Maximum Capacity</th>
              <th>Credit Hours</th>
              <th>Tuition Cost</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.string_id}>
                <td>{course.string_id}</td>
                <td>{course.title}</td>
                <td>{course.description}</td>
                <td>{course.schedule}</td>
                <td>{course.classroom_number}</td>
                <td>{course.maximum_capacity}</td>
                <td>{course.credit_hours}</td>
                <td>{course.tuition_cost}</td>
                <td>
                  <button onClick={() => handleDeleteCourse(course.string_id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;
