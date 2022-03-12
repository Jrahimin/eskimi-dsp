import {React, useState, useEffect} from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {AxiosReq} from "../shared/AxiosReq";
import {ApiEndpoints} from "../shared/ApiEndpoints";
import { useParams } from "react-router-dom";

function CampaignAdd() {
    const navigate = useNavigate();
    const params = useParams();
    const [formData, setFormData] = useState({
        name: '',
        from_date: new Date(),
        to_date: new Date(),
        daily_budget: 0,
        total_budget: 0,
    });
    const [errorMsg, setErrorMessage] = useState('');

    //const [formData, setFormData] = useState(campaign);

    useEffect(() => {
        AxiosReq(`../${ApiEndpoints.CAMPAIGN}/${params.id}`, {}, (data) => {
            const campaignData = data.data.data;
            console.log('data: ',campaignData);

            if (data.code && data.code !== 200) {
                setErrorMessage(data.message);
                return;
            }

            setFormData(campaignData);

        }, 'get');
    }, []);

    const handleFormData = (e) => {
        const {name, value} = e.target;

        console.log(name, value);

        formData[name] = value;
        setFormData({ ...formData });
    }

    const handleDate = (date, name) => {
        console.log('in date', date, name);
        formData[name] = date;
        setFormData({ ...formData });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setErrorMessage('');

        formData.from_date = moment(formData.from_date).format('YYYY-MM-DD');
        formData.to_date = moment(formData.to_date).format('YYYY-MM-DD');

        AxiosReq(`../${ApiEndpoints.CAMPAIGN}/${params.id}`, formData, (data) => {
            console.log('data: ', data);

            if (data.code === undefined) {
                setErrorMessage("Something went wrong. Please, try again later.");
                return;
            }

            if (data.code !== 200) {
                setErrorMessage(data.message);
                return;
            }

            navigate('/');
        },'put', false);
    }
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">Add Campaign</div>

                        <div className="card-body">
                            <form onSubmit={onSubmit}>
                                <div className="form-group mb-2">
                                    <label htmlFor="name">Campaign Name</label>
                                    <input type="text" className="form-control" name="name" placeholder="Enter Name"
                                    onChange={handleFormData} value={formData.name || ''} required/>
                                </div>

                                <div className="form-group mb-2">
                                    <label htmlFor="daily_budget">Daily Budget</label>
                                    <input type="number" className="form-control" name="daily_budget" placeholder="Enter Daily Budget"
                                    onChange={handleFormData} value={formData.daily_budget || ''}/>
                                </div>

                                <div className="form-group mb-2">
                                    <label htmlFor="total_budget">Total Budget</label>
                                    <input type="number" className="form-control" name="total_budget" placeholder="Enter Total Budget"
                                    onChange={handleFormData} value={formData.total_budget || ''}/>
                                </div>

                                <div className="form-group  mb-2">
                                    <label htmlFor="from_date">From</label>
                                    <DatePicker name="from_date"
                                                className="form-control"
                                                dateFormat="yyyy-MM-dd"
                                                selected={new Date(formData.from_date)}
                                                onChange={(date) => handleDate(date, 'from_date')}
                                    />
                                </div>
                                <div className="form-group  mb-2">
                                    <label htmlFor="to_date">To</label>
                                    <DatePicker name="to_date"
                                                className="form-control"
                                                dateFormat="yyyy-MM-dd"
                                                selected={new Date(formData.to_date)}
                                                onChange={(date) => handleDate(date, 'to_date')}
                                    />
                                </div>

                                <button type="submit" className="btn btn-info">Update</button>

                                {errorMsg && <div className="text-danger mt-2">
                                    <span>{errorMsg}</span>
                                </div>}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CampaignAdd;