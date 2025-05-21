import "./Foodwiki.css";
import react from "react";
import { useState } from "react";
import {assets} from "../../assets/assets";

const Foodwiki = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [logo, setLogo] = useState(assets.OpenfoodfactsLogo);
    const onMove = () => {setLogo(assets.OpenfoodfactsTitle);}
    const onLeave = () => {setLogo(assets.OpenfoodfactsLogo);}
    const onClick = () => {setIsOpen(!isOpen);}

    const [term, setTerm] = useState('');
    const [result, setResult] = useState(null);


    return (
        <div className="foodwiki-logo">
        <img src={logo} onClick={onClick} onMouseMove={onMove} onMouseLeave={onLeave} alt="Foodwiki Logo" className="foodwiki-logo" />
        <div className={`foodwiki-window ${isOpen ? 'show' : ''}`}>
            <h1>OpenFoodFacts</h1>
            <input value={term} onChange={e => setTerm(e.target.value)} placeholder="Search food..." />
            <button  >Search</button>

            

        </div>
        </div>
    );
}
export default Foodwiki;