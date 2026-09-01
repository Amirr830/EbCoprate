import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
FaPaperPlane,
FaCommentDots,
FaTimes
} from "react-icons/fa";
import "./css/CommentSuggestion.css";

export default function CommentSuggestion({
params,
onSubmit,
}) {


const navigate = useNavigate();

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

        setMessage("");
        setSelectedCategory("");

    } catch (error) {
        console.error("خطا در ثبت دیدگاه:", error);
    } finally {
        setIsSubmitting(false);
    }
};

const renderCategories = () => {
    const categories = getFeedbackCategories();

    return categories.map((category) => {
        const isSelected =
            selectedCategory === category.id;

        return (
            <button
                key={category.id}
                type="button"
                className={`feedback-category-card ${
                    isSelected ? "active" : ""
                } ${category.color}`}
                onClick={() =>
                    setSelectedCategory(category.id)
                }
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

return (
    <div
        className="feedback-page"
        dir="rtl"
    >

        <Container
            fluid
            className="feedback-container"
        >

            <Row className="feedback-header-row align-items-center">

                <Col
                    xs={12}
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
                                    setMessage(
                                        event.target.value
                                    )
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

                    <Col
                        xs={6}
                        lg={6}
                        className="feedback-button-column"
                    >

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

                    <Col
                        xs={6}
                        lg={6}
                        className="feedback-button-column"
                    >

                        <button
                            type="button"
                            className="feedback-cancel-button btn btn-danger"
                            onClick={() => {
                                setMessage("");
                                setSelectedCategory("");
                                navigate("/");
                            }}
                            disabled={isSubmitting}
                        >

                            <FaTimes />

                            <span>
                                انصراف
                            </span>

                        </button>

                    </Col>

                </Row>

            </form>

        </Container>

    </div>
);


}
