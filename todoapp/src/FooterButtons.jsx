import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setScreen } from "./redux/screenSlice";

function FooterButtons() {

    const dispatch = useDispatch();

    return (
        <>
<div className="Footer">
  <button onClick={() => dispatch(setScreen("tasks"))} className="Fbutton">
    📝
    <span className="label">Görevler</span>
  </button>
  <button onClick={() => dispatch(setScreen("completed"))} className="Fbutton">
    ✅
    <span className="label">Tamamlananlar</span>
  </button>
  <button onClick={() => dispatch(setScreen("important"))} className="Fbutton">
    ⭐
    <span className="label">Önemli</span>
  </button>
  <button onClick={() => dispatch(setScreen("calendar"))} className="Fbutton">
    📅
    <span className="label">Takvim</span>
  </button>
</div>

        </>
    )
}

export default FooterButtons;