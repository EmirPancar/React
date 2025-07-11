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
      <button
        onClick={geri}
        className="prevBut"
        disabled={ekran === 1}
        style={{
          opacity: ekran === 1 ? 0.5 : 1,
          pointerEvents: ekran === 1 ? "none" : "auto",
        }}
      >
        Önceki Sayfa
      </button>

      <StepIndicator ekran={ekran} />

      <button
        onClick={ileri}
        className="nextBut"
        disabled={ekran === 4 || !ileriAktif}
        style={{
          opacity: ekran === 4 || !ileriAktif ? 0.5 : 1,
          pointerEvents: ekran === 4 || !ileriAktif ? "none" : "auto",
        }}
      >
        Sonraki Sayfa
      </button>
    </div>
  );
}

export default Footer;
