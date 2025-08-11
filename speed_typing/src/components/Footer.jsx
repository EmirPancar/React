import './FooterStyle.css';
import FooterEmoji from '../Images/Footer_Emoji.png'

const Footer = () => {
    return (
        <div className='FooterContainer'>
            <p className='FooterText'>-Emir Pancar</p>

            <img 
                src={FooterEmoji} 
                alt="Footer Emoji" 
                className='FooterImage' 
            />
        </div>
    );
}

export default Footer;