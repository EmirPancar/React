import React, { useState, useEffect } from "react";

function Form3({ formData, setFormData, setIsFormValid }) {
  const [touched, setTouched] = useState({});

  const isValid = {
    sorunOzet: formData.sorunOzet?.trim().length > 0,
    sorunDetay: formData.sorunDetay?.trim().length > 0,
    dahaOnceSorun: formData.dahaOnceSorun === "evet" || formData.dahaOnceSorun === "hayir",
  };

  const allValid = Object.values(isValid).every(Boolean);

  useEffect(() => {
    setIsFormValid(allValid);
  }, [formData, touched]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const getIconClass = (field) => {
    if (!touched[field]) return "";
    return isValid[field] ? "icon success" : "icon error";
  };

  return (
    <>
      <h2 className="form-header" style={{ marginBottom: "30px" }}>
        Sorun Tanımı ve Detaylar
      </h2>
      <div
        className="form-grid-2x2"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "60px 80px",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        {/* Sol: Özet + Radyo */}
        <div style={{ display: "flex", flexDirection: "column", gap: "60px" }}>
          <div className="form-cell">
            <label style={{ width: "100px", marginRight:"-30px" }}>Özet:</label>
            <div className="input-wrapper" style={{ position: "relative" }}>
              <input
                type="text"
                name="sorunOzet"
                value={formData.sorunOzet || ""}
                onChange={handleChange}
                placeholder="Kısa özet"
              />
              <span className={getIconClass("sorunOzet")} />
            </div>
          </div>

          <div className="form-cell" style={{ gap: "15px" }}>
            <label style={{ width: "120px" }}>Daha Önce Bu Sorun Yaşandı mı?</label>
            <div style={{ display: "flex", alignItems: "center", gap: "20px", position: "relative" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <input
                  type="radio"
                  name="dahaOnceSorun"
                  value="evet"
                  checked={formData.dahaOnceSorun === "evet"}
                  onChange={handleChange}
                />
                Evet
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                <input
                  type="radio"
                  name="dahaOnceSorun"
                  value="hayir"
                  checked={formData.dahaOnceSorun === "hayir"}
                  onChange={handleChange}
                />
                Hayır
              </label>
              <span className={getIconClass("dahaOnceSorun")} style={{ right: "-30px" }} />
            </div>
          </div>
        </div>  

        {/* Sağ: Açıklama */}
        <div className="form-cell" style={{ alignItems: "flex-start", marginLeft: "-100px" }}>
          <label style={{ marginTop: "8px", width: "100px",marginRight:"5px" }}>Açıklama:</label>
          <div className="input-wrapper" style={{ position: "relative" }}>
            <textarea
              name="sorunDetay"
              value={formData.sorunDetay || ""}
              onChange={handleChange}
              rows={5}
              placeholder="Detaylı açıklama"
              style={{
                width: "320px",
                padding: "10px",
                fontSize: "15px",
                border: "1px solid #bbb",
                borderRadius: "6px",
              }}
            />
            <span className={getIconClass("sorunDetay")} style={{ right: "-25px", top: "20px" }} />
          </div>
        </div>
      </div>
    </>
  );
}

export default Form3;
