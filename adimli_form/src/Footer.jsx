import StepIndicator from "./StepIndicator";

function Footer({ ekran, setEkran, ileriAktif }) {
  const ileri = () => {
    if (ekran < 4 && ileriAktif) {
      setEkran(ekran + 1);
    }
  };

  const geri = () => {
    if (ekran > 1) {
      setEkran(ekran - 1);
    }
  };

  return (
    <div className="Footer">
      <button onClick={geri} className="prevBut">Önceki Sayfa</button>

      <StepIndicator ekran={ekran} />

      <button
        onClick={ileri}
        className="nextBut"
        disabled={!ileriAktif}
        style={{
          opacity: ileriAktif ? 1 : 0.5,
          pointerEvents: ileriAktif ? "auto" : "none",
        }}
      >
        Sonraki Sayfa
      </button>
    </div>
  );
}

export default Footer;