
import React, { useRef, useState } from "react";
import { Row, Col, Form, Offcanvas } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./css/Ticket.css";
import {
    FaPaperPlane,
    FaTimes,
    FaPaperclip,
    FaFileAlt,
    FaWallet,
    FaBars,
} from "react-icons/fa";
import SideBar from "../Dashboard/SideBar";

function Ticket() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        subject: "",
        priority: "normal",
        category: "",
        description: "",
        attachment: null,
    });

    const [fileName, setFileName] = useState("");
    const [showMenu, setShowMenu] = useState(false);

    const fileInputRef = useRef(null);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previousData) => ({
            ...previousData,
            [name]: value,
        }));
    };

    const handleFileChange = (event) => {
        const selectedFile = event.target.files?.[0];

        if (!selectedFile) {
            return;
        }

        setFormData((previousData) => ({
            ...previousData,
            attachment: selectedFile,
        }));

        setFileName(selectedFile.name);
    };

    const openFileSelector = () => {
        fileInputRef.current?.click();
    };

    const removeFile = () => {
        setFormData((previousData) => ({
            ...previousData,
            attachment: null,
        }));

        setFileName("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const resetForm = () => {
        setFormData({
            subject: "",
            priority: "normal",
            category: "",
            description: "",
            attachment: null,
        });

        setFileName("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const submittedData = {
            ...formData,
            attachment: formData.attachment,
        };

        console.log("Ticket data:", submittedData);

        resetForm();
    };

    const handleBack = () => {
        navigate(-1);
    };

    const handleCloseMenu = () => {
        setShowMenu(false);
    };

    const handleShowMenu = () => {
        setShowMenu(true);
    };

    const handleWalletClick = () => {
        navigate("/control-panel/67/definitions/wallet");
    };

    return (
        <div className="ticket-page" dir="rtl">
            <div className="ticket-mobile-header d-md-none">
                <div className="ticket-mobile-header-inner">
                    <div className="ticket-mobile-page-title">
                    </div>
                </div>
            </div>

            <Offcanvas
                show={showMenu}
                onHide={handleCloseMenu}
                placement="end"
                dir="rtl"
                className="custom-mobile-menu p-0"
            >
                <Offcanvas.Header className="d-flex justify-content-end align-items-center border-bottom pb-2 pt-3 px-3">
                    <button
                        type="button"
                        className="btn p-0 border-0 text-muted"
                        onClick={handleCloseMenu}
                    >
                        <FaTimes size={20} />
                    </button>
                </Offcanvas.Header>

                <Offcanvas.Body className="p-0 overflow-hidden">
                    <SideBar />
                </Offcanvas.Body>
            </Offcanvas>

            <div className="ticket-page-wrapper">
                <Row className="w-100 m-0">
                    <Col xs={12} className="p-0">
                        <Form onSubmit={handleSubmit}>
                            <main className="ticket-content">
                                <Row className="ticket-row g-3">
                                    <Col xs={12} lg={8}>
                                        <section className="ticket-section">
                                            <div className="section-title">
                                                <span className="section-number">
                                                    ۱
                                                </span>

                                                <div>
                                                    <h3>موضوع درخواست</h3>

                                                    <span className="section-description">
                                                        عنوان کوتاه و واضحی برای درخواست خود وارد کنید.
                                                    </span>
                                                </div>
                                            </div>

                                            <Form.Group controlId="ticketSubject">
                                                <Form.Label>
                                                    عنوان تیکت
                                                    <span className="required-mark">
                                                        *
                                                    </span>
                                                </Form.Label>

                                                <Form.Control
                                                    type="text"
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    placeholder="مثلاً: مشکل در ورود به حساب کاربری"
                                                    required
                                                />
                                            </Form.Group>
                                        </section>
                                    </Col>

                                    <Col xs={12} lg={4}>
                                        <section className="ticket-section">
                                            <div className="section-title">
                                                <span className="section-number">
                                                    ۲
                                                </span>

                                                <div>
                                                    <h3>اولویت درخواست</h3>
                                                </div>
                                            </div>

                                            <div className="priority-list">
                                                <label
                                                    className={`priority-item priority-low ${
                                                        formData.priority === "low"
                                                            ? "active"
                                                            : ""
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="priority"
                                                        value="low"
                                                        checked={
                                                            formData.priority ===
                                                            "low"
                                                        }
                                                        onChange={handleChange}
                                                    />

                                                    <span className="priority-radio" />

                                                    <span className="priority-text">
                                                        پایین
                                                    </span>
                                                </label>

                                                <label
                                                    className={`priority-item priority-normal ${
                                                        formData.priority ===
                                                        "normal"
                                                            ? "active"
                                                            : ""
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="priority"
                                                        value="normal"
                                                        checked={
                                                            formData.priority ===
                                                            "normal"
                                                        }
                                                        onChange={handleChange}
                                                    />

                                                    <span className="priority-radio" />

                                                    <span className="priority-text">
                                                        عادی
                                                    </span>
                                                </label>

                                                <label
                                                    className={`priority-item priority-high ${
                                                        formData.priority === "high"
                                                            ? "active"
                                                            : ""
                                                    }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="priority"
                                                        value="high"
                                                        checked={
                                                            formData.priority ===
                                                            "high"
                                                        }
                                                        onChange={handleChange}
                                                    />

                                                    <span className="priority-radio" />

                                                    <span className="priority-text">
                                                        فوری
                                                    </span>
                                                </label>
                                            </div>
                                        </section>
                                    </Col>

                                    <Col xs={12} md={6}>
                                        <section className="ticket-section">
                                            <div className="section-title">
                                                <span className="section-number">
                                                    ۳
                                                </span>

                                                <div>
                                                    <h3>
                                                        دسته‌بندی درخواست
                                                    </h3>

                                                    <span className="section-description">
                                                        نوع درخواست خود را انتخاب کنید.
                                                    </span>
                                                </div>
                                            </div>

<Form.Group controlId="ticketCategory"> 
    <div className="category-select-wrapper"> 
        <Form.Select 
            name="category" 
            value={formData.category} 
            onChange={handleChange} 
            className="category-select" 
        > 
            <option value=""> 
                انتخاب دسته‌بندی 
            </option> 

            <option value="account"> 
                حساب کاربری 
            </option> 

            <option value="technical"> 
                مشکل فنی 
            </option> 

            <option value="payment"> 
                پرداخت و مالی 
            </option> 

            <option value="suggestion"> 
                پیشنهاد و انتقاد 
            </option> 
        </Form.Select> 

        <span className="category-select-arrow"> 
            <span></span> 
        </span> 
    </div> 
</Form.Group>
                                        </section>
                                    </Col>

                                    <Col xs={12} md={6}>
                                        <section className="ticket-section description-section">
                                            <div className="section-title">
                                                <span className="section-number">
                                                    ۴
                                                </span>

                                                <div>
                                                    <h3>شرح درخواست</h3>

                                                    <span className="section-description">
                                                        جزئیات مشکل یا درخواست خود را وارد کنید.
                                                    </span>
                                                </div>
                                            </div>

                                            <Form.Group controlId="ticketDescription">
                                                <Form.Label>
                                                    توضیحات
                                                    <span className="required-mark">
                                                        *
                                                    </span>
                                                </Form.Label>

                                                <Form.Control
                                                    as="textarea"
                                                    rows={5}
                                                    name="description"
                                                    value={
                                                        formData.description
                                                    }
                                                    onChange={handleChange}
                                                    placeholder="شرح مشکل، زمان رخداد و اقداماتی را که انجام داده‌اید اینجا بنویسید..."
                                                    className="ticket-textarea"
                                                    required
                                                />

                                                <div className="textarea-footer">
                                                    <span>
                                                        {
                                                            formData.description
                                                                .length
                                                        }{" "}
                                                        کاراکتر
                                                    </span>
                                                </div>
                                            </Form.Group>
                                        </section>
                                    </Col>

                                    <Col xs={12}>
                                        <section className="ticket-section">
                                            <div className="section-title">
                                                <span className="section-number">
                                                    ۵
                                                </span>

                                                <div>
                                                    <h3>پیوست فایل</h3>

                                                    <span className="section-description">
                                                        در صورت نیاز فایل مرتبط با درخواست را ارسال کنید.
                                                    </span>
                                                </div>
                                            </div>

                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                className="d-none"
                                                onChange={handleFileChange}
                                                accept="image/*,.pdf,.doc,.docx,.zip"
                                            />

                                            {!fileName ? (
                                                <button
                                                    type="button"
                                                    className="upload-box"
                                                    onClick={openFileSelector}
                                                >
                                                    <span className="upload-icon">
                                                        <FaPaperclip />
                                                    </span>

                                                    <span className="upload-content">
                                                        <span>
                                                            برای انتخاب فایل کلیک کنید
                                                        </span>

                                                        <small>
                                                            فرمت‌های مجاز: JPG، PNG، PDF، DOC و ZIP
                                                        </small>
                                                    </span>

                                                    <FaPaperclip className="upload-clip" />
                                                </button>
                                            ) : (
                                                <div className="selected-file">
                                                    <div className="selected-file-icon">
                                                        <FaFileAlt />
                                                    </div>

                                                    <div className="selected-file-content">
                                                        <span>
                                                            {fileName}
                                                        </span>

                                                        <small>
                                                            فایل با موفقیت انتخاب شد.
                                                        </small>
                                                    </div>

                                                    <button
                                                        type="button"
                                                        className="remove-file-button"
                                                        onClick={removeFile}
                                                        aria-label="حذف فایل"
                                                    >
                                                        <FaTimes />
                                                    </button>
                                                </div>
                                            )}
                                        </section>
                                    </Col>
                                </Row>
                            </main>

                            <footer className="ticket-footer">
                                <Row className="w-100 g-2">
                                    <Col xs={12} sm={6}>
                                        <button
                                            type="submit"
                                            className="submit-ticket-button"
                                        >
                                            <FaPaperPlane />

                                            <span>ارسال</span>
                                        </button>
                                    </Col>

                                    <Col xs={12} sm={6}>
                                        <button
                                            type="button"
                                            className="cancel-button"
                                            onClick={handleBack}
                                        >
                                            <FaTimes />

                                            <span>انصراف</span>
                                        </button>
                                    </Col>
                                </Row>
                            </footer>
                        </Form>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default Ticket;
