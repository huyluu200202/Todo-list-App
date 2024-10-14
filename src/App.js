import './App.css';
import Header from './views/layouts/header';
import Footer from './views/layouts/footer';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes'; 

function App() {
    return (
        <Router>
            <Header />
            <AppRoutes /> 
            <Footer />
        </Router>
    );
}

export default App;
