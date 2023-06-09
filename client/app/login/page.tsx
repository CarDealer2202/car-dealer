'use client';
import { useEffect, useState } from "react";
import styles from './page.module.css'
import { useRouter } from 'next/navigation';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("Щось не працює");
  const router = useRouter();


  useEffect(()=>{
    if (localStorage.getItem('refreshToken') &&
        localStorage.getItem('accessToken') &&
        localStorage.getItem('expiresIn') &&
        localStorage.getItem('user')) {
        router.push('/shop')
    }
  },[])

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fetchRegistration =async (password:string, email:string) => {
        const body = {password, email}
        const registerResponce = await fetch(`http://localhost:8080/auth/signIn`,{
                                            method:'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify(body)})
        const result = registerResponce.body
        if (registerResponce.status == 200) {
          const json = await registerResponce.json()
          const currentTimeInMillis = Date.now();
          const currentTimeInSeconds = Math.floor(currentTimeInMillis / 1000); 
          localStorage.setItem('refreshToken', json.refreshToken)
          localStorage.setItem('accessToken', json.accessToken)
          localStorage.setItem('expiresIn', currentTimeInSeconds+json.expiresIn) 
          localStorage.setItem('user', JSON.stringify(json.user))
          router.push('/shop');
        }
        if (registerResponce.status == 401) {
          setMessage("Email чи Пароль невiрнi")
          setShowMessage(true)
          setTimeout(()=>setShowMessage(false),3000)
        }
        return result
      }
      fetchRegistration(password, email).then(()=>{

          window.dispatchEvent(new Event("storage"));
      })
  };

    const handleGoogleAuth = () => {
        const authUrl = 'http://localhost:8080/auth/google';
        const windowFeatures = 'width=600,height=600,menubar=no,toolbar=no';
      
        const authWindow = window.open(authUrl, '_blank', windowFeatures);
      
        const handleAuthResult = (event:any) => {
          // Check if the event origin matches the backend URL
          if (event.origin === 'http://localhost:8080') {
            // Process the authentication result
            // Extract the data from event.data and close the popup window
            console.log(event.data);
            const json = event.data
            const currentTimeInMillis = Date.now();
            const currentTimeInSeconds = Math.floor(currentTimeInMillis / 1000); 
            localStorage.setItem('refreshToken', json.refreshToken)
            localStorage.setItem('accessToken', json.accessToken)
            localStorage.setItem('expiresIn', currentTimeInSeconds+json.expiresIn) 
            localStorage.setItem('user', JSON.stringify(json.user))
            router.push('/shop');
            window.dispatchEvent(new Event("storage"));
            if (authWindow) {
                authWindow.close();
            }
          }
        };
      
        window.addEventListener('message', handleAuthResult);
      };

    useEffect(() => {
        const handleTabClosed = () => {
          // Clean up the event listener when the component unmounts or the tab is closed
          window.removeEventListener('message', handleGoogleAuth);
        };
    
        // Listen for the 'beforeunload' event to detect when the new tab is closed
        window.addEventListener('beforeunload', handleTabClosed);
    
        return () => {
          // Clean up the event listener when the component unmounts
          window.removeEventListener('beforeunload', handleTabClosed);
        };
      }, []);

//   useEffect(() => {
//     const handleCallback = async () => {
//       try {
//         // Step 2: Fetch data from the Google callback URL
//         const response = await fetch(
//           'http://localhost:8080/auth/google/callback' + window.location.search
//         );
//         const data = await response.json();

//         // Step 3: Handle the acquired data
//         // ...

//         // Step 4: Redirect the user to the desired page
//         router.push('/shop');
//       } catch (error) {
//         console.error('Error during Google callback:', error);
//       }
//     };

//     if (window.location.pathname === '/auth/google/callback') {
//       handleCallback();
//     }
//   }, []);

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

        <div className={styles["button-group"]}>
        <div className={styles["google-group"]}>
            <button onClick={handleGoogleAuth} type="button" className={styles["google-login-button"]}>
                <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/2008px-Google_%22G%22_Logo.svg.png' className={styles["google-icon"]}></img>
            </button>
        </div>
          <button type="submit" className={styles["login-button"]}>
            Логiн
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







