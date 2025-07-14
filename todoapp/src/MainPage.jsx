import React from "react";
import { useSelector} from "react-redux";
import Tasks from './Tasks'
import Completed from './Completed'
import Important from './Important'
import Calendar from './Calendar'

function MainPage(){  
    
    const currentScreen = useSelector((state) => state.screen.currentScreen);

    const renderScreen = () => {
    switch (currentScreen) {
      case "tasks":
        return <Tasks/>;
      case "completed":
        return <Completed/>;
      case "important":
        return <Important/>;
      case "calendar":
        return <Calendar/>;
      default:
        return <div>🤷 Ekran bulunamadı</div>;
    }
  };


    return( 
        <div className="Main"> 

            {renderScreen()}
            
        </div>
    );
}

export default MainPage;    