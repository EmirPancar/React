import React, { useRef, useState } from 'react';


function FormBody() {

    const formRef = useRef(null);

    const [secilenSehir, setSecilenSehir] = useState('');
    const [secilenIlce, setSecilenIlce] = useState('');

    const [Ad, setAd] = useState("");
    const [Soyad, setSoyad] = useState("");


    const handleSubmit = (e) => {
         e.preventDefault();


        if (formRef.current.checkValidity() && Ad.trim() !== "" && Soyad.trim() !== "" && isNaN(Ad) && isNaN(Soyad)) {
            
            alert("Bilgiler kaydedildi");
        } else {
            formRef.current.reportValidity();
            alert("Lütfen geçerli ad ve soyad girin");
        }

    };


    const sehirVeIlceler = {
        İstanbul: ['Kağıthane', 'Beşiktaş', 'Üsküdar'],
        Hatay: ['Antakya', 'İskenderun', 'Dörtyol'],
        Amasya: ['Merkez', 'Suluova', 'Taşova'],
        Eskişehir: ['Tepebaşı', 'Odunpazarı'],
        Antalya: ['Muratpaşa', 'Kepez', 'Alanya'],
    };

    const handleSehirChange = (e) => {
        setSecilenSehir(e.target.value);
        setSecilenIlce('');
    };

    return (

        <div>
            <form className="Form" ref={formRef} onSubmit={handleSubmit}>

                <p className="pBaslik"><b>KİŞİSEL BİLGİLER</b></p>

                <div className="form-row">

                    <label>Ad:</label>
                    <input type="text" className="FormInput" placeholder="Adınızı Girin" value={Ad} onChange={(e) => setAd(e.target.value)} required />

                    <label2>Tel No:</label2>
                    <input type="tel" className="FormInput" pattern="^5\d{2} \d{3} \d{2} \d{2}$" placeholder="5xx xxx xx xx" required />

                </div>


                <div className="form-row">

                    <label>Soyad:</label>
                    <input type="text" className="FormInput" placeholder="Soyadınızı Girin" value={Soyad} onChange={(e) => setSoyad(e.target.value)} required />

                    <label2>E-mail:</label2>
                    <input type="email" className="FormInput" placeholder="ornek@gmail.com" required />

                </div>


                <div className="form-row2">

                    <label>Cinsiyet:</label>
                    <label2>Erkek</label2><input type="radio" name="cinsiyet" />
                    <label2>Kadın</label2><input type="radio" name="cinsiyet" />

                    <label style={{ marginLeft: 220, marginRight: 15 }}>Doğum Tarihi:</label>
                    <input type="date" className="FormInput" style={{ fontSize: 18, paddingLeft: 20, paddingRight: 20, height: 25 }} required />

                </div>


                <div className="form-row">

                    <label>Adres:</label>
                    <select
                        className="FormInput"
                        style={{ width: 120, height: 30 }}
                        value={secilenSehir}
                        onChange={handleSehirChange}
                        required
                    >
                        <option value="" disabled hidden>Şehir Seç</option>
                        {Object.keys(sehirVeIlceler).map((sehir) => (
                            <option key={sehir} value={sehir}>{sehir}</option>
                        ))}
                    </select>

                    <select
                        className="FormInput"
                        style={{ width: 120, height: 30, marginLeft: 10 }}
                        value={secilenIlce}
                        onChange={(e) => setSecilenIlce(e.target.value)}
                        required
                        disabled={!secilenSehir}
                    >
                        <option value="" disabled hidden>İlçe Seç</option>
                        {secilenSehir &&
                            sehirVeIlceler[secilenSehir].map((ilce) => (
                                <option key={ilce} value={ilce}>{ilce}</option>
                            ))}
                    </select>

                </div>

                <div className='FormFooter'>

                    <input type="submit" value="Kaydet" />
                    <input type="reset" value="Temizle" />

                </div>



            </form>
        </div>


    );
}

export default FormBody;