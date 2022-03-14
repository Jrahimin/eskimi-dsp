import {React, useEffect, useState} from 'react';
import moment from 'moment';
import {useNavigate, useParams} from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {AxiosReq} from "../shared/AxiosReq";
import {ApiEndpoints} from "../shared/ApiEndpoints";
import {FormAppend} from "../shared/FormAppend";

function CampaignAdd() {
    const navigate = useNavigate();
    const params = useParams();
    const [files, setFiles] = useState();
    const [errorMsg, setErrorMessage] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        from_date: new Date(),
        to_date: new Date(),
        daily_budget: 0,
        total_budget: 0,
    });

    if(params.id){
        useEffect(() => {
            AxiosReq(`../${ApiEndpoints.CAMPAIGN}/${params.id}`, {}, (data) => {
                const campaignData = data.data.data;

                if (data.code && data.code !== 200) {
                    setErrorMessage(data.message);
                    return;
                }

                setFormData(campaignData);

            }, 'get');
        }, []);
    }

    const handleFormData = (e) => {
        const {name, value} = e.target;
        formData[name] = value;
        setFormData({ ...formData });
    }

    const handleDate = (date, name) => {
        formData[name] = date;
        setFormData({ ...formData });
    };

    const onSubmit = (e) => {
        e.preventDefault();
        setErrorMessage('');

        formData.from_date = moment(formData.from_date).format('YYYY-MM-DD');
        formData.to_date = moment(formData.to_date).format('YYYY-MM-DD');

        if(params.id){
            sendReq(`../${ApiEndpoints.CAMPAIGN}/${params.id}`, formData,'put',false);
        } else{
            let dataArray = FormAppend(formData);
            for (let i = 0; i < files?.length; i++) {
                dataArray.append("files[]", files[i]);
            }

            sendReq(ApiEndpoints.CAMPAIGN, dataArray);
        }

        function sendReq(url, reqData, method='post', hasFile=true){
            AxiosReq(url, reqData, (data) => {
                if (data.code !== 200) {
                    setErrorMessage(data.message);
                    return;
                }

                navigate('/');
            },method, hasFile);
        }
    }
    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">{params.id ? 'Update' : 'Add'} Campaign</div>

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

                                {!params.id && <div className="form-group  mb-2">
                                    <label htmlFor="files">Upload Files</label>
                                    <input type="file"  className="form-control" name="files" multiple
                                           onChange={(e) => setFiles(e.target.files)} required/>
                                </div>}

                                <button type="submit" className="btn btn-info">{params.id ? 'Update' : 'Submit'}</button>

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
