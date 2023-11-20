import { BrowserRouter,Route,Routes } from 'react-router-dom';
import { Navbar } from './components/NavBar';
import FindUsers from './FindUsers';
import DebankCreator from './DebankCreator';

export default function App() {

  




    return (

      <BrowserRouter>
        
       <div>
          <Navbar/>
            <Routes>
              <Route path="/DebankCreator" element={<DebankCreator />} />
              <Route path="/FindUsers" element={<FindUsers />} />
            </Routes>
       </div>
      </BrowserRouter>
    )
  }

