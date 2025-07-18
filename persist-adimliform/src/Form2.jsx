import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateForm, setFormValid } from "./redux/formSlice";

function Form2() {
  const dispatch = useDispatch();
  const formData = useSelector((state) => state.form.formData);
  const [touched, setTouched] = useState({});

  const isValid = {
    urunTipi: formData.urunTipi?.length > 0,
    cihazModeli: formData.cihazModeli?.trim().length > 1,
    seriNo: /^\d{8}$/.test(formData.seriNo),
    kullanimSuresi: formData.kullanimSuresi?.length > 0,
  };

  const allValid = Object.values(isValid).every(Boolean);

  useEffect(() => {
    dispatch(setFormValid(allValid));
  }, [formData, touched, allValid, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    dispatch(updateForm({ [name]: value }));
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const getIconClass = (field) => {
    if (!touched[field]) return "";
    return isValid[field] ? "icon success" : "icon error";
  };

  return (
    <>
      <h2 className="form-header">Cihaz Bilgisi</h2>
      <div className="form-grid-2x2 with-header">
        <div className="form-cell">
          <label>Ürün Tipi:</label>
          <div className="input-wrapper">
            <select
              name="urunTipi"
              value={formData.urunTipi || ""}
              onChange={handleChange}
              className="urunSelect"
            >
              <option value="">Seçiniz</option>
              <option value="Telefon">Telefon</option>
              <option value="Tablet">Tablet</option>
              <option value="Bilgisayar">Bilgisayar</option>
            </select>
            <span className={getIconClass("urunTipi")}></span>
          </div>
        </div>

        <div className="form-cell">
          <label>Model:</label>
          <div className="input-wrapper">
            <input
              type="text"
              name="cihazModeli"
              value={formData.cihazModeli || ""}
              onChange={handleChange}
              placeholder="Cihaz Modeli"
            />
            <span className={getIconClass("cihazModeli")}></span>
          </div>
        </div>

        <div className="form-cell">
          <label style={{ marginRight: "10px" }}>Seri No:</label>
          <div className="input-wrapper">
            <input
              type="text"
              name="seriNo"
              value={formData.seriNo || ""}
              onChange={handleChange}
              placeholder="8 haneli seri no"
              maxLength={8}
            />
            <span className={getIconClass("seriNo")}></span>
          </div>
        </div>

        <div className="form-cell">
          <label>Kullanım:</label>
          <div className="input-wrapper">
            <select
              name="kullanimSuresi"
              value={formData.kullanimSuresi || ""}
              onChange={handleChange}
              className="kullanimSelect"
            >
              <option value="">Seçiniz</option>
              <option value="0-6 ay">0-6 ay</option>
              <option value="12 ay">12 ay</option>
              <option value="12-18 ay">12-18 ay</option>
              <option value="18-24 ay">18-24 ay</option>
              <option value="+2 yıl">+2 yıl</option>
            </select>
            <span className={getIconClass("kullanimSuresi")}></span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Form2;
