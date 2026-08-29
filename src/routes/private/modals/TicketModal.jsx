import React, { useEffect, useRef, useState } from "react";
import { Modal, Row, Col, Form } from "react-bootstrap";
import { FaPaperPlane, FaTimes } from "react-icons/fa";
import "./Css/TicketModal.css"

export default function AddDefMsgModal(props) {
    const [show, setShow] = useState(false);

    const [formData, setFormData] = useState({
        subject: "",
        priority: "normal",
        category: "",
        description: "",
        attachment: null,
    });

    const [fileName, setFileName] = useState("");
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (show) {
            // عملیات موردنظر هنگام بازشدن مودال
        }
    }, [show]);

    const handleShow = (event) => {
        props?.onOpen?.(event);
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
    };

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
        handleClose();
    };

    let triggerElement = null;

    if (props?.children) {
        const child = Array.isArray(props.children)
            ? props.children[0]
            : props.children;

        if (React.isValidElement(child)) {
            triggerElement = React.cloneElement(child, {
                onClick: (event) => {
                    child.props?.onClick?.(event);
                    handleShow(event);
                },
            });
        }
    }

    return (
        <>
            {triggerElement}

            <Modal
                show={show}
                onHide={handleClose}
                centered
                size="lg"
                dir="rtl"
                className="ticket-modal"
                aria-labelledby="new-ticket-modal-title"
            >
                <Modal.Body className="ticket-modal-body p-0">
                    <div className="ticket-container">

                        <header className="ticket-header">
                            <button
                                type="button"
                                className="ticket-close-button"
                                onClick={handleClose}
                                aria-label="بستن مودال"
                            >
                                <i className="bi bi-x-lg" />
                            </button>
                            <div className="ticket-header-content">

                                <div className="ticket-header-text">
                                    <h2 id="new-ticket-modal-title">
                                        ایجاد تیکت جدید
                                    </h2>

                                </div>
                                <div className="ticket-icon">
                                    <i className="bi bi-headset" />
                                </div>
                            </div>

                        </header>

                        <Form onSubmit={handleSubmit}>
                            <main className="ticket-content">
                                <Row className="ticket-row">

                                    <Col xs={12} lg={8}>
                                        <section className="ticket-section">
                                            <div className="section-title">
                                                <span className="section-number">
                                                    ۱
                                                </span>

                                                <div>
                                                    <h3>موضوع درخواست</h3>
                                                </div>
                                            </div>

                                            <Form.Group controlId="ticketSubject">
                                                <Form.Label>
                                                    عنوان تیکت
                                                    <span className="required-mark">
                                                        *
                                                    </span>
                                                </Form.Label>

                                                <div className="input-with-icon">
                                                    <i className="bi bi-pencil-square" />

                                                    <Form.Control
                                                        type="text"
                                                        name="subject"
                                                        value={formData.subject}
                                                        onChange={handleChange}
                                                        placeholder="مثلاً: مشکل در ورود به حساب کاربری"
                                                        required
                                                    />
                                                </div>
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
                                                    <h3>اولویت</h3>
                                                </div>
                                            </div>

                                            <div className="priority-list">
                                                <label
                                                    className={`priority-item priority-low ${formData.priority === "low"
                                                        ? "active"
                                                        : ""
                                                        }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="priority"
                                                        value="low"
                                                        checked={
                                                            formData.priority === "low"
                                                        }
                                                        onChange={handleChange}
                                                    />

                                                    <span className="priority-radio" />

                                                    <span className="priority-text">
                                                        پایین
                                                    </span>
                                                </label>

                                                <label
                                                    className={`priority-item priority-normal ${formData.priority === "normal"
                                                        ? "active"
                                                        : ""
                                                        }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="priority"
                                                        value="normal"
                                                        checked={
                                                            formData.priority === "normal"
                                                        }
                                                        onChange={handleChange}
                                                    />

                                                    <span className="priority-radio" />

                                                    <span className="priority-text">
                                                        عادی
                                                    </span>
                                                </label>

                                                <label
                                                    className={`priority-item priority-high ${formData.priority === "high"
                                                        ? "active"
                                                        : ""
                                                        }`}
                                                >
                                                    <input
                                                        type="radio"
                                                        name="priority"
                                                        value="high"
                                                        checked={
                                                            formData.priority === "high"
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
                                        <section className="ticket-section category-section">
                                            <div className="section-title">
                                                <span className="section-number">
                                                    ۳
                                                </span>

                                                <div className="section-heading-content">
                                                    <h3>دسته‌بندی</h3>

                                                    <p>
                                                        نوع درخواست را انتخاب کنید.
                                                    </p>
                                                </div>
                                            </div>

                                            <Form.Group controlId="ticketCategory">

                                                <div className="select-field-wrapper">
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
                                                    rows={4}
                                                    name="description"
                                                    value={formData.description}
                                                    onChange={handleChange}
                                                    placeholder="شرح مشکل، زمان رخداد و اقداماتی را که انجام داده‌اید اینجا بنویسید..."
                                                    className="ticket-textarea"
                                                    required
                                                />

                                                <div className="textarea-footer">
                                                    <span>
                                                        توضیحات دقیق‌تر باعث پاسخ بهتر می‌شود.
                                                    </span>

                                                    <span>
                                                        {formData.description.length} کاراکتر
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
                                                        <i className="bi bi-cloud-arrow-up" />
                                                    </span>

                                                    <span className="upload-content">
                                                        <p>
                                                            برای انتخاب فایل کلیک کنید
                                                        </p>

                                                        <small>
                                                            فرمت‌های مجاز: JPG، PNG،
                                                            PDF، DOC و ZIP
                                                        </small>
                                                    </span>

                                                    <i className="bi bi-paperclip upload-clip" />
                                                </button>
                                            ) : (
                                                <div className="selected-file">
                                                    <div className="selected-file-icon">
                                                        <i className="bi bi-file-earmark-check" />
                                                    </div>

                                                    <div className="selected-file-content">
                                                        <p>
                                                            {fileName}
                                                        </p>

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
                                                        <i className="bi bi-trash3" />
                                                    </button>
                                                </div>
                                            )}
                                        </section>
                                    </Col>
                                </Row>
                            </main>

                            <footer className="ticket-footer">
                                <button
                                    type="submit"
                                    className="submit-ticket-button"
                                >
                                    <FaPaperPlane
                                        style={{
                                            fontSize: "14px",
                                            marginLeft: "8px",
                                        }}
                                    />
                                    <span>ارسال</span>
                                </button>

                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={handleClose}
                                >
                                    <FaTimes
                                        style={{
                                            fontSize: "17px",
                                            marginLeft: "8px",
                                        }}
                                    />
                                    <span>انصراف</span>
                                </button>
                            </footer>
                        </Form>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}