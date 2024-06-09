import React from 'react';
import "./EmailViewer.css"

const EmailViewer = ({ htmlContent }) => {
    return (
        <div className='singleMail' dangerouslySetInnerHTML={{ __html: htmlContent}} />
    );
};

export default EmailViewer;

