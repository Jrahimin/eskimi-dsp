import {React, useState} from 'react';
import Modal from "react-responsive-modal";

export const PreviewModal = ({isOpen, basePath, campaignUploads, setModelState}) => {
    console.log('uploads: ',campaignUploads)
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
                        <div className="col-md-8 mb-2">
                            <img alt="uploads" src={basePath+file.file_path} style={{height:"100px"}}/>
                        </div>
                    )
                })}
            </div>
        </Modal>
    )
}
