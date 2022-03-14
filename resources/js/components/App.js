import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";
import Navbar from './Navbar';
import CampaignList from "./campaign/CampaignList";
import CampaignAdd from "./campaign/CampaignAdd";
import {AddCampaignUploads} from "./campaign/AddCampaignUploads";

function App() {
    return (
        // <div className="container">
        //     <div className="row justify-content-center">
        //         <div className="col-md-8">
        //             <div className="card">
        //                 <div className="card-header">Example Component</div>
        //
        //                 <div className="card-body">I'm an example component!</div>
        //             </div>
        //         </div>
        //     </div>
        // </div>
        <>
            <BrowserRouter>
                <Navbar/>
                <br/>
                <Routes>
                    <Route path="/" element={<CampaignList />} />
                    <Route path="/add" element={<CampaignAdd />} />
                    <Route path="/add/:id" element={<CampaignAdd />} />
                    <Route path="/uploads/:id" element={<AddCampaignUploads />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));
}
