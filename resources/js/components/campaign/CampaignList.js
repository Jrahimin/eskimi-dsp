import {React, useState, useEffect} from 'react';
import {ApiEndpoints} from "../shared/ApiEndpoints";
import {AxiosReq} from "../shared/AxiosReq";
import { Link } from 'react-router-dom';

function CampaignList() {
    const [campaignList, setCampaignList] = useState([]);
    const [errorMsg, setErrorMessage] = useState('');

    useEffect(() => {
        AxiosReq(ApiEndpoints.CAMPAIGN, {}, (data) => {
            const listData = data.data.data;
            console.log('list data: ',listData);

            if (data.code && data.code !== 200) {
                setErrorMessage(data.message);
                return;
            }

            setCampaignList(listData);
        }, 'get');
    }, []);

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
                                    <th scope="col">Images</th>
                                    <th scope="col">Edit</th>
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
                                            <td>
                                                {campaign.uploads && campaign.uploads.map(file => {
                                                    return(
                                                        <img alt="uploads" src={file.file_path} style={{height: "10%"}}/>
                                                    )
                                                }) }
                                            </td>
                                            <td><Link className="btn btn-sm btn-primary" to={`edit/${campaign.id}`}>Edit</Link></td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CampaignList;
