import React from "react";
import { useSelector } from "react-redux";

function Form4() {
  const formData = useSelector((state) => state.form.formData);

  const handleSubmit = () => {
    alert("Form başarıyla gönderildi!");
    console.log("Gönderilen Veriler:", formData);
  };

  return (
    <>
      <h2
        className="form-header"
        style={{ textAlign: "center", marginBottom: "10px" }}
      >
        Özet ve Onay
      </h2>
      <div
        className="form-grid-2x2 with-header"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "20px 35px",
          maxWidth: "900px",
          margin: "0 auto",
          textAlign: "left",
        }}
      >
        <div>
          <strong>Ad:</strong>
          <br />
          {formData.ad}
        </div>
        <div>
          <strong>Soyad:</strong>
          <br />
          {formData.soyad}
        </div>
        <div>
          <strong>Tel:</strong>
          <br />
          {formData.tel}
        </div>
        <div>
          <strong>Email:</strong>
          <br />
          {formData.email}
        </div>

        <div>
          <strong>Ürün Tipi:</strong>
          <br />
          {formData.urunTipi}
        </div>
        <div>
          <strong>Model:</strong>
          <br />
          {formData.cihazModeli}
        </div>
        <div>
          <strong>Seri No:</strong>
          <br />
          {formData.seriNo}
        </div>
        <div>
          <strong>Kullanım:</strong>
          <br />
          {formData.kullanimSuresi}
        </div>

        <div style={{ gridColumn: "1 / 2" }}>
          <strong>Daha Önce Yaşandı mı:</strong>
          <br />
          {formData.dahaOnceSorun}
        </div>

        <div style={{ gridColumn: "2 / 4" }}>
          <strong>Açıklama:</strong>
          <br />
          {formData.sorunDetay}
        </div>

        <div style={{ gridColumn: "4 / 5" }}>
          <strong>Özet:</strong>
          <br />
          {formData.sorunOzet}
        </div>

        <div
          style={{ gridColumn: "1 / -1", marginTop: "20px", textAlign: "center" }}
        >
          <button
            className="nextBut"
            onClick={handleSubmit}
            style={{
              padding: "10px 20px",
              fontSize: "18px",
              borderRadius: "8px",
            }}
          >
            Gönder
          </button>
        </div>
      </div>
    </>
  );
}

export default Form4;
