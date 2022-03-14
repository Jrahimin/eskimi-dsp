import {React, useEffect, useState} from 'react';
import {ApiEndpoints} from "../shared/ApiEndpoints";
import {FormAppend} from "../shared/FormAppend";
import {AxiosReq} from "../shared/AxiosReq";
import {Link, useNavigate, useParams} from "react-router-dom";

export const AddCampaignUploads = () => {
    const [campaign, setCampaign] = useState({
        uploads:[]
    });
    const [basePath, setBasePath] = useState('');
    const [errorMsg, setErrorMessage] = useState('');
    const [files, setFiles] = useState();
    const params = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        AxiosReq(`../${ApiEndpoints.CAMPAIGN}/${params.id}`, {}, (data) => {
            const campaignData = data.data.data;

            if (data.code && data.code !== 200) {
                setErrorMessage(data.message);
                return;
            }

            setCampaign(campaignData);
            setBasePath(data.data.path);
        }, 'get');
    }, []);

    const onSubmit = (e,id) => {
        e.preventDefault();
        setErrorMessage('');
        const {name} = e.target;

        if(name === 'fileDel'){
            sendReq(`../${ApiEndpoints.CAMPAIGN}/${id}`, {},'delete',false);
        } else{
            let dataArray = new FormData();
            dataArray.append('id', params.id);
            for (let i = 0; i < files?.length; i++) {
                dataArray.append("files[]", files[i]);
            }

            sendReq('../'+ApiEndpoints.CAMPAIGN_UPLOAD, dataArray);
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
    return(
        <div className="col-md-8 offset-2">
            <h3>Creative Uploads</h3>
            <hr/>
            {campaign.uploads.map((file, i) => {
                return(
                    <div className="col-md-4 mb-2">
                        <div className="thumbnail mb-2">
                            <img key={i} alt="uploads" src={basePath+file.file_path} style={{width:"100%"}}/>
                        </div>

                        <form onSubmit={e=>onSubmit(e,file.id)} name="fileDel">
                            <button type="submit" className="btn btn-danger">delete</button>
                        </form>
                    </div>
                )
            })}

            <br/>
            <h3>Upload Files</h3>
            <hr/>
            <form onSubmit={onSubmit} name="fileUp">
                <div className="form-group  mb-2">
                    <input type="file"  className="form-control" name="files" multiple
                           onChange={(e) => setFiles(e.target.files)} required/>
                </div>

                <div className="mb-5">
                    <button type="submit" className="btn btn-info mr-2">Upload</button>
                    <Link className="btn btn-primary" to="/">Back</Link>

                    {errorMsg && <div className="text-danger mt-2">
                        <span>{errorMsg}</span>
                    </div>}
                </div>
                <hr/><br/>
            </form>
        </div>
    )
}
