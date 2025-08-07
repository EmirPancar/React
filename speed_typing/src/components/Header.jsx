import './HeaderStyle.css';
import { useDispatch } from 'react-redux';
import { toggleLeaderboard } from '../redux/leaderboardSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy } from '@fortawesome/free-solid-svg-icons'; 


const Header = () => {
  const dispatch = useDispatch();

  return (
    <div className="HeaderContainer">
      <div className="Logo">Yaz Bakim Nası Yazıyon</div>
      <button className='LeaderBoardButton' onClick={() => dispatch(toggleLeaderboard())}>
        <FontAwesomeIcon icon={faTrophy} />
      </button>
    </div>
  );
};

export default Header;