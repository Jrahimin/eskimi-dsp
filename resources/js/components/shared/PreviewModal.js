import {React} from 'react';
import Modal from "react-responsive-modal";

export const PreviewModal = ({isOpen, basePath, campaignUploads, setModelState}) => {
    return(
        <Modal open={isOpen} onClose={() => setModelState(false)} center>
            <div className="modal-header text-center">
                <h4>
                    Campaign Creative Uploads
                    <hr />
                </h4>
            </div>
            <br />
            <div className="modal-body">
                {campaignUploads.map((file, i) => {
                    return(
                        <div className="col-md-4 mb-2">
                            <div className="thumbnail">
                                <img alt="uploads" src={basePath+file.file_path} style={{width:"100%"}}/>
                            </div>
                        </div>
                    )
                })}
            </div>
        </Modal>
    )
}
