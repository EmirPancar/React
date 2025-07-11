import React, { useState, useEffect } from "react";

function Form1({ formData, setFormData, setIsFormValid }) {
    
    const [touched, setTouched] = useState({});

  const isValid = {
    ad: formData.ad.trim().length > 1,
    soyad: formData.soyad.trim().length > 1,
    tel: /^5\d{2}\s?\d{3}\s?\d{2}\s?\d{2}$/.test(formData.tel),
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
  };

  const allValid = Object.values(isValid).every(Boolean);

  useEffect(() => {
    setIsFormValid(allValid);
  }, [formData, touched]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;
    if (name === "ad" || name === "soyad") {
      newValue = value.replace(/[0-9]/g, "");
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const getIconClass = (field) => {
    if (!touched[field]) return "";
    return isValid[field] ? "icon success" : "icon error";
  };

    return (
<>
    <h2 className="form-header">Kişisel Bilgiler</h2>
        <div className="form-grid-2x2 with-header">
            <div className="form-cell">
                <label>Ad:</label>
                <div className="input-wrapper">
                    <input
                        type="text"
                        name="ad"
                        value={formData.ad}
                        onChange={handleChange}
                        placeholder="Adınız"
                    />
                    <span className={getIconClass("ad")}></span>
                </div>
            </div>

            <div className="form-cell">
                <label>Soyad:</label>
                <div className="input-wrapper">
                    <input
                        type="text"
                        name="soyad"
                        value={formData.soyad}
                        onChange={handleChange}
                        placeholder="Soyadınız"
                    />
                    <span className={getIconClass("soyad")}></span>
                </div>
            </div>

            <div className="form-cell">
                <label>Tel No:</label>
                <div className="input-wrapper">
                    <input
                        type="tel"
                        name="tel"
                        value={formData.tel}
                        onChange={handleChange}
                        placeholder="5xx xxx xx xx"
                    />
                    <span className={getIconClass("tel")}></span>
                </div>
            </div>

            <div className="form-cell">
                <label>E-mail:</label>
                <div className="input-wrapper">
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="ornek@gmail.com"
                    />
                    <span className={getIconClass("email")}></span>
                </div>
            </div>
        </div>
        </>
    );
}

export default Form1;
