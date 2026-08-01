import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import "./Css/SupportTrainingModal.css";
import { 
  FaHeadset, 
  FaPhoneAlt, 
  FaPaperPlane, 
  FaCommentDots, 
  FaGraduationCap, 
  FaTimes 
} from "react-icons/fa";
import { MdOutlineSupportAgent } from "react-icons/md";
export default function AddDefMsgModal(props) {
    const [show, setShow] = useState(false);

    const handleShow = () => {
        setShow(true);
    };

    let newFirstChild;

    if (props?.children) {
        newFirstChild = React.cloneElement(
            props.children?.length > 1 ? props.children[0] : props.children,
            { onClick: handleShow }
        );
    }

    return (
        <>
            {newFirstChild}

            <Modal
                show={show}
                centered
                onHide={() => setShow(false)}
                dialogClassName="support-modal"
            >
                <Modal.Body className="support-modal-body" dir="rtl">
                    <button
                        className="support-close-btn"
                        onClick={() => setShow(false)}
                        aria-label="Close"
                    >
                        <FaTimes />
                    </button>

                    <h6 className="support-title">
                        پشتیبانی و آموزش
                    </h6>

                    <div className="support-card">

                        <div className="support-top-section">
                            
                            <div className="support-avatar-wrapper">
                                <div className="support-avatar-icon">
                                    <MdOutlineSupportAgent  />
                                </div>
                            </div>

                            <div className="support-contact-list">
                                <div className="support-contact-item">
                                    <span className="contact-text">تماس با پشتیبانی</span>
                                    <FaPhoneAlt className="contact-icon" />
                                </div>

                                <div className="support-contact-item">
                                    <span className="contact-text">تماس با مدیریت</span>
                                    <FaPhoneAlt className="contact-icon" />
                                </div>
                            </div>

                        </div>

                        <div className="support-actions">
                            <button className="support-action-btn">
                                <span>ارسال تیکت جدید</span>
                            </button>

                            <button className="support-action-btn">
                                <span>نظرات و پیشنهادات</span>
                            </button>

                            <button className="support-action-btn">
                                <span>آموزش استفاده از پنل</span>
                            </button>
                        </div>

                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}