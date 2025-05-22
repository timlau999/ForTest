import "./Foodwiki.css";
import react from "react";
import { useState } from "react";
import {assets} from "../../assets/assets";
import axios from "axios";

const Foodwiki = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [logo, setLogo] = useState(assets.OpenfoodfactsLogo);
    const onMove = () => {setLogo(assets.OpenfoodfactsTitle);}
    const onLeave = () => {setLogo(assets.OpenfoodfactsLogo);}
    const onClick = () => {setIsOpen(!isOpen);}

    const [term, setTerm] = useState('');
    const [result, setResult] = useState(null);
    const [foodDetail, setFoodDetail] = useState(null);
    const [foodDetail2, setFoodDetail2] = useState(null);
    

   const search = async (term) => {
    try {
      const response = await axios.post(`http://localhost:4000/api/openfooddata/getOpenFoodData`,
        {term}
      );
        if (response.data.success) {
          setResult(response.data.data);
          console.log('get open food data successfully');}
        else {
          console.log('Failed to fetch open food data');
          alert('Failed to fetch open food data');
        }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const showFoodDetail = async (id) => {
    try{
      const response = await axios.post(`http://localhost:4000/api/openfooddata/getOpenFoodDetail`,
    {id}
    );
      
        setFoodDetail(response.data.data);
        setFoodDetail2(response.data.data2);
        console.log('get open food detail successfully');
      
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

    
    return (
        <div className="foodwiki-logo">
        <img src={logo} onClick={onClick} onMouseMove={onMove} onMouseLeave={onLeave} alt="Foodwiki Logo" className="foodwiki-logo" />
          <div className={`foodwiki-window ${isOpen ? 'show' : ''}`}>
            <h3>Spoonacular API</h3>
            <input className="foodwiki-window-input" value={term} onChange={e => setTerm(e.target.value)} placeholder="Search food..." />
            <button className="openfood-item-button" onClick={()=>search(term)} >Search</button>
            
            <h3>Search Results:</h3>
            {result && (
                <div className="openfood-result">
                    {result.map((item, index) => (
                        <div className="openfood-item" key={index}>
                          <img src={item.image} alt={item.name} />
                          <p>{item.name}</p>
                          <button className="openfood-item-button" onClick={()=>showFoodDetail(item.id)}>Choose</button>
                        </div>
                      ))}
                </div>
            )}
            
            <div className="openfood-detail-container">
            
            {foodDetail && (
                <div className="openfood-detail">
                      <h4>Nutrition Info.:</h4>
                      {foodDetail2 && (
                        <div className="openfood-detail-item">
                          <p>Weight per serving: {foodDetail2.amount}{foodDetail2.unit}</p>
                        </div>
                      )}
                    {foodDetail.map((item, index) => (
                        <div className="openfood-detail-item" key={index}>
                          <p>{item.name}: {item.amount}{item.unit}, {item.percentOfDailyNeeds}% of daily need </p>
                        </div>
                      ))}
                    
                </div>
            )}
            </div>
        </div>
        </div>
    );
}
export default Foodwiki;