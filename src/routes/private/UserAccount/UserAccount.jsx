import React, { useState } from "react";
import { Row, Col } from "react-bootstrap";
import {
    FiUser,
    FiPhone,
    FiLock,
    FiBriefcase,
    FiMapPin,
    FiCreditCard,
    FiShield,
    FiEdit3,
    FiCheckCircle
} from "react-icons/fi";
import "./Css/UserAccount.css";
function UserAccount() {
    const [formData, setFormData] = useState({
        fullName: "",
        companyName: "",
        serviceType: "",
        address: "",
        registrationNumber: "",
        phone: "",
        username: "",
        password: ""
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
    };
    return (
        <div className="user-account-page">
            <div className="user-account-wrapper">
                <form onSubmit={handleSubmit}>
                    <Row className="account-row g-4">
                        <Col xs={12} lg={4}>
                            <div className="profile-card">
                                <div className="profile-card-top">
                                    <div className="profile-large-avatar">
                                        <FiUser />
                                    </div>
                                    <button type="button" className="edit-profile-btn">
                                        <FiEdit3 />
                                    </button>
                                </div>
                                <div className="profile-status">
                                    <div className="status-icon">
                                        <FiCheckCircle />
                                    </div>
                                    <div>
                                        <span style={{fontSize:"15px"}}>وضعیت حساب</span>
                                        <strong style={{fontSize:"15px"}}>فعال</strong>
                                    </div>
                                </div>
                                <div className="profile-divider"></div>
                                <div className="profile-item">
                                    <div className="profile-item-icon">
                                        <FiUser />
                                    </div>
                                    <div>
                                        <span style={{fontSize:"15px"}}>نام کاربری</span>
                                        <strong style={{fontSize:"15px"}}>{formData.username || "وارد نشده"}</strong>
                                    </div>
                                </div>
                                <div className="profile-item">
                                    <div className="profile-item-icon">
                                        <FiPhone />
                                    </div>
                                    <div>
                                        <span style={{fontSize:"15px"}}>شماره همراه</span>
                                        <strong style={{fontSize:"15px"}}>{formData.phone || "وارد نشده"}</strong>
                                    </div>
                                </div>
                                <div className="profile-item">
                                    <div className="profile-item-icon">
                                        <FiShield />
                                    </div>
                                    <div>
                                        <span style={{fontSize:"15px"}}>امنیت حساب</span>
                                        <strong className="security-text" style={{fontSize:"15px"}}>محافظت شده</strong>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col xs={12} lg={8}>
                            <div className="account-form-card">
        
                                <Row className="form-row g-3">
                                    <Col xs={12} md={6}>
                                        <div className="account-input-group">
                                            <label style={{fontSize:"15px"}}>نام و نام خانوادگی<span>*</span></label>
                                            <div className="input-wrapper">
                                                <FiUser />
                                                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="نام و نام خانوادگی" />
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <div className="account-input-group">
                                            <label style={{fontSize:"15px"}}>نام شرکت / فروشگاه<span>*</span></label>
                                            <div className="input-wrapper">
                                                <FiBriefcase />
                                                <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} placeholder="نام شرکت یا فروشگاه" />
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <div className="account-input-group">
                                            <label style={{fontSize:"15px"}}>نوع خدمات<span>*</span></label>
                                            <div className="input-wrapper">
                                                <FiBriefcase />
                                                <input type="text" name="serviceType" value={formData.serviceType} onChange={handleChange} placeholder="نوع خدمات" />
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <div className="account-input-group">
                                            <label style={{fontSize:"15px"}}>شماره ثبت</label>
                                            <div className="input-wrapper">
                                                <FiCreditCard />
                                                <input type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} placeholder="شماره ثبت" />
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <div className="account-input-group">
                                            <label style={{fontSize:"15px"}}>شماره همراه<span>*</span></label>
                                            <div className="input-wrapper">
                                                <FiPhone />
                                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="09xxxxxxxxx" />
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xs={12} md={6}>
                                        <div className="account-input-group">
                                            <label style={{fontSize:"15px"}}>نام کاربری<span>*</span></label>
                                            <div className="input-wrapper">
                                                <FiUser />
                                                <input type="text" name="username" value={formData.username} onChange={handleChange} placeholder="نام کاربری" />
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xs={12}>
                                        <div className="account-input-group">
                                            <label style={{fontSize:"15px"}}>آدرس</label>
                                            <div className="input-wrapper textarea-wrapper">
                                                <FiMapPin />
                                                <textarea name="address" value={formData.address} onChange={handleChange} placeholder="آدرس کامل خود را وارد کنید" rows="3"></textarea>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <div className="security-section">
                                    <div className="security-section-header">
                                        <div className="security-section-icon">
                                            <FiLock />
                                        </div>
                                        <div>
                                            <h3 style={{fontSize:"15px"}}>امنیت حساب</h3>
                                        </div>
                                    </div>
                                    <Row className="g-3">
                                        <Col xs={12} md={6}>
                                            <div className="account-input-group">
                                                <label style={{fontSize:"15px"}}>رمز عبور<span>*</span></label>
                                                <div className="input-wrapper">
                                                    <FiLock />
                                                    <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="رمز عبور" />
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                                <div className="form-footer">
                                    <button type="submit" className="btn btn-success">
                                        <FiCheckCircle style={{marginLeft:"8px"}}/>
                                        <span>ذخیره اطلاعات</span>
                                    </button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </form>
            </div>
        </div>
    );
}
export default UserAccount;