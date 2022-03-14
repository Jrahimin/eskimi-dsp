import {React, useState, useEffect} from 'react';
import {ApiEndpoints} from "../shared/ApiEndpoints";
import {AxiosReq} from "../shared/AxiosReq";
import { Link } from 'react-router-dom';
import 'react-responsive-modal/styles.css';
import {PreviewModal} from "../shared/PreviewModal";

function CampaignList() {
    const [basePath, setBasePath] = useState('');
    const [campaignUploads, setCampaignUploads] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [campaignList, setCampaignList] = useState([]);
    const [errorMsg, setErrorMessage] = useState('');

    useEffect(() => {
        AxiosReq(ApiEndpoints.CAMPAIGN, {}, (data) => {
            const listData = data.data.data;
            if (data.code !== 200) {
                setErrorMessage(data.message);
                return;
            }

            setCampaignList(listData);
            setBasePath(data.data.path);
        }, 'get');
    }, []);

    const onPreview = (uploads) => {
        setOpenModal(true)
        setCampaignUploads(uploads);
    }

    return (
        <div>
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">Campaigns</div>
                        <div className="card-body">
                            <table className="table table-hover">
                                <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Daily Budget</th>
                                    <th scope="col">Total Budget</th>
                                    <th scope="col">From</th>
                                    <th scope="col">To</th>
                                    <th scope="col">Edit</th>
                                    <th scope="col">Preview</th>
                                    <th scope="col">Manage Uploads</th>
                                </tr>
                                </thead>
                                <tbody>
                                {campaignList.map((campaign, i) => {
                                    return(
                                        <tr key={i}>
                                            <th scope="row">{++i}</th>
                                            <td>{ campaign.name }</td>
                                            <td>{ campaign.daily_budget }</td>
                                            <td>{ campaign.total_budget }</td>
                                            <td>{ campaign.from_date }</td>
                                            <td>{ campaign.to_date }</td>
                                            <td><Link className="btn btn-sm btn-primary" to={`add/${campaign.id}`}>Edit</Link></td>
                                            <td>
                                                <a className="btn btn-sm btn-primary" href="#" onClick={(e) => onPreview(campaign.uploads)(e)}>Preview</a>
                                            </td>
                                            <td><Link className="btn btn-sm btn-info" to={`uploads/${campaign.id}`}>Manage</Link></td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <PreviewModal isOpen={openModal} basePath={basePath} campaignUploads={campaignUploads} setModelState={setOpenModal}/>
            </div>
        </div>
    );
}

export default CampaignList;
