'use client';
import { useState } from "react";
import styles from './page.module.css'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handlePasswordCheckChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordCheck(event.target.value);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fetchRegistration =async (password:string, email:string, name: string) => {
      const body = {password, email, name}
      const registerResponce = await fetch(`http://localhost:8080/auth/signUp`,{method:'POST',headers: { 'Content-Type': 'application/json' },body: JSON.stringify(body)})
      const result = registerResponce.body
      console.log(registerResponce.status)
      if (registerResponce.status == 409) {
        setMessage("Email вже існує")
      }
      if (registerResponce.status == 500) {
        const json = await registerResponce.json()
        setMessage(json.message)
      }else if(registerResponce.status != 201){
        setMessage("Щось не працює")
      }
      setShowMessage(true)
      setTimeout(()=>setShowMessage(false),3000)
      return result
    }

    if (password === passwordCheck) {
      fetchRegistration(password, email, name)
    }
  };

  return (
    <div className={styles["login-page"]}>
      <form className={styles["login-form"]} onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={handleEmailChange}
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={handlePasswordChange}
          
        />

        <label htmlFor="password">Confirm Password</label>
        <input
          type="password"
          id="passwordCheck"
          value={passwordCheck}
          onChange={handlePasswordCheckChange}
        />

        <label htmlFor="password">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={handleNameChange}
        />

        <div className={styles["button-group"]}>
          <button type="submit" className={styles["login-button"]}>
          Зареєструватися
          </button>
        </div>
      </form>
      {showMessage && 
      <div className={styles["message-popup"]}>
        <p>{message}</p>
      </div>}
    </div>
  );
};

export default Login;







