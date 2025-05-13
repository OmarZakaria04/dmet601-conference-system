// import React, { useState } from 'react';
// import '.form.css';

// function Register() {
//   const [form, setForm] = useState({ username: '', email: '', password: '' });

//   const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async e => {
//     e.preventDefault();
//     const res = await fetch('http://localhost:5000/api/auth/register', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(form)
//     });
//     const data = await res.json();
//     alert(data.message);
//   };

//   return (
//     <form className="form-container" onSubmit={handleSubmit}>
//       <h2>Register</h2>
//       <input name="username" placeholder="Username" onChange={handleChange} required />
//       <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
//       <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
//       <button type="submit">Register</button>
//     </form>
//   );
// }

// export default Register;
