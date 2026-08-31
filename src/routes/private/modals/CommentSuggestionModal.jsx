import React, { useEffect, useState } from "react";
import { Modal, Container, Row, Col } from "react-bootstrap";
import {
    FaPaperPlane,
    FaTimes,
    FaCommentDots
} from "react-icons/fa";
import "./Css/CommentSuggestionModal.css";

export default function AddDefMsgModal({
    children,
    params,
    onSubmit,
}) {
    const [show, setShow] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getFeedbackCategories = () => {
        return [
            {
                id: "service",
                title: "کیفیت سرویس",
                icon: "✦",
                color: "green",
            },
            {
                id: "speed",
                title: "سرعت اینترنت",
                icon: "⚡",
                color: "blue",
            },
            {
                id: "coverage",
                title: "پوشش شبکه",
                icon: "⌁",
                color: "purple",
            },
            {
                id: "support",
                title: "پشتیبانی",
                icon: "♧",
                color: "orange",
            },
            {
                id: "billing",
                title: "صورتحساب",
                icon: "▣",
                color: "red",
            },
            {
                id: "other",
                title: "سایر موارد",
                icon: "⋯",
                color: "gray",
            },
        ];
    };

    useEffect(() => {
        if (show) {
            const categories = getFeedbackCategories();


            if (categories.length > 0) {
                setSelectedCategory(categories[0].id);
            }
        }

        if (!show) {
            setMessage("");
            setSelectedCategory("");
        }


    }, [show]);

    const handleShow = (event) => {
        event?.preventDefault?.();
        setShow(true);
    };

    const handleClose = () => {
        if (!isSubmitting) {
            setShow(false);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();


        if (!selectedCategory || !message.trim()) {
            return;
        }

        const categories = getFeedbackCategories();

        const selectedItem = categories.find(
            (item) => item.id === selectedCategory
        );

        const formData = {
            category: selectedCategory,
            categoryTitle: selectedItem?.title || "",
            message: message.trim(),
            params,
        };

        try {
            setIsSubmitting(true);

            if (onSubmit) {
                await onSubmit(formData);
            }

            setShow(false);
        } catch (error) {
            console.error("خطا در ثبت دیدگاه:", error);
        } finally {
            setIsSubmitting(false);
        }


    };

    const renderCategories = () => {
        const categories = getFeedbackCategories();


        return categories.map((category) => {
            const isSelected = selectedCategory === category.id;

            return (
                <button
                    key={category.id}
                    type="button"
                    className={`feedback-category-card ${isSelected ? "active" : ""
                        } ${category.color}`}
                    onClick={() => setSelectedCategory(category.id)}
                >
                    <span className="feedback-category-icon">
                        {category.icon}
                    </span>

                    <span className="feedback-category-title">
                        {category.title}
                    </span>

                    {isSelected && (
                        <span className="feedback-selected-mark">
                            ✓
                        </span>
                    )}
                </button>
            );
        });


    };

    const triggerElement = React.isValidElement(children)
        ? React.cloneElement(children, {
            onClick: (event) => {
                children.props?.onClick?.(event);
                handleShow(event);
            },
        })
        : (<button
            type="button"
            className="default-feedback-trigger"
            onClick={handleShow}
        >
            ثبت دیدگاه </button>
        );

    return (
        <>
            {triggerElement}


            <Modal
                show={show}
                onHide={handleClose}
                centered
                dialogClassName="feedback-modal-dialog"
                contentClassName="feedback-modal-content"
                backdropClassName="feedback-modal-backdrop"
                keyboard={!isSubmitting}
                size="lg"
            >
                <Modal.Body
                    className="feedback-modal-body"
                    dir="rtl"
                >
                    <Container
                        fluid
                        className="feedback-container"
                    >
                        <Row className="feedback-header-row align-items-center">
                            <Col
                                xs={2}
                                className="text-end"
                            >
                                <button
                                    type="button"
                                    className="feedback-close-button"
                                    onClick={handleClose}
                                    disabled={isSubmitting}
                                    aria-label="بستن"
                                >
                                    <FaTimes />
                                </button>
                            </Col>

                            <Col
                                xs={10}
                                className="d-flex justify-content-end"
                            >
                                <div className="feedback-title-wrapper">
                                    <div className="feedback-title-content">
                                        <h2 className="feedback-title">
                                            نظرات و پیشنهادها
                                        </h2>
                                    </div>

                                    <div className="feedback-title-icon">
                                        <FaCommentDots />
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        <form onSubmit={handleSubmit}>
                            <Row className="feedback-section-row">
                                <Col xs={12}>
                                    <div className="feedback-section-heading">
                                        <span className="feedback-heading-line" />

                                        <h3>
                                            موضوع نظر شما چیست؟
                                        </h3>
                                    </div>

                                    <div className="feedback-category-grid">
                                        {renderCategories()}
                                    </div>
                                </Col>
                            </Row>

                            <Row className="feedback-section-row">
                                <Col xs={12}>
                                    <div className="feedback-section-heading">
                                        <span className="feedback-heading-line" />

                                        <h3>
                                            توضیحات و دیدگاه شما
                                        </h3>
                                    </div>

                                    <div className="feedback-textarea-wrapper">
                                        <textarea
                                            className="feedback-textarea"
                                            value={message}
                                            onChange={(event) =>
                                                setMessage(event.target.value)
                                            }
                                            placeholder="دیدگاه خود را درباره خدمات با ما در میان بگذارید..."
                                            maxLength={500}
                                            rows={6}
                                        />

                                        <div className="feedback-character-count">
                                            {message.length} / 500
                                        </div>
                                    </div>
                                </Col>
                            </Row>

                            <Row className="feedback-footer-row align-items-center">
                                <Col xs={12} lg={6}>
                                    <button
                                        type="submit"
                                        className="feedback-submit-button"
                                        disabled={
                                            !selectedCategory ||
                                            !message.trim() ||
                                            isSubmitting
                                        }
                                    >
                                        <FaPaperPlane />

                                        <span>
                                            {isSubmitting
                                                ? "در حال ثبت..."
                                                : "ثبت"}
                                        </span>
                                    </button>
                                </Col>

                                <Col xs={12} lg={6}>
                                    <button
                                        type="button"
                                        className="feedback-cancel-button btn btn-danger"
                                        onClick={handleClose}
                                        disabled={isSubmitting}
                                    >
                                        <FaTimes style={{marginLeft:"8px"}}/>
                                        <span>
                                            انصراف
                                        </span>
                                    </button>
                                </Col>

                            </Row>

                        </form>
                    </Container>
                </Modal.Body>
            </Modal>
        </>


    );
}
