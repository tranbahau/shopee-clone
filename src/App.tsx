import { useContext, useEffect } from 'react';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import useRouteElement from 'src/hooks/useRouteElement';
import { LocalStorageEventTarget } from './utils/auth';
import AppContext from './context/app.context';

function App() {
  const element = useRouteElement();
  const { reset } = useContext(AppContext);

  useEffect(() => {
    LocalStorageEventTarget.addEventListener('clearLS', reset);
  }, [reset]);

  return (
    <div>
      {element}
      <ToastContainer
        position='top-right'
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme='light'
      />
    </div>
  );
}

export default App;
