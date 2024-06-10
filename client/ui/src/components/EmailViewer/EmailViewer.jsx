import React from "react";
import "./EmailViewer.css";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

const EmailViewer = ({ mail, open, handleClose }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="mailContainer">
        <div className="mailData">
          <Typography
            color="#1f1f1f"
            variant="h5"
            component="h1"
            sx={{ fontWeight: 400 }}
            title={mail.subject}
          >
            {mail.subject.length > 50
              ? mail.subject.substring(0, 50) + "..."
              : mail.subject}
          </Typography>
          <Typography color="secondary" variant="subtitle3" component="h1">
            {mail.date.substring(0, 25)}
          </Typography>
          <Typography color="secondary" variant="subtitle3" component="h1">
            {mail?.sender}
          </Typography>
        </div>
        <div className="singleMail">
        <div
          dangerouslySetInnerHTML={{ __html: mail.htmlBody }}
        />
        </div>
        
      </div>
    </Modal>
  );
};

export default EmailViewer;
