import './FooterStyle.css';

const Footer = () => {
    return (
        <div className='FooterContainer'>
            <p className='FooterText'>-Emir Pancar</p>

            <img 
                src={`${process.env.PUBLIC_URL}/Images/Footer_emoji.png`} 
                alt="Footer Emoji" 
                className='FooterImage' 
            />
        </div>
    );
}

export default Footer;