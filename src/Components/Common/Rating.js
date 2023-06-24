import React from "react";
import ReactStars from "react-rating-stars-component";
const Raiting = (user)=>{
    return(<>
        <ReactStars
            count={5}
            onChange={() => {
            }}
            edit={false}
            size={24}
            value={user?.rating}
            isHalf={true}
            emptyIcon={<i className="far fa-star"/>}
            halfIcon={<i className="fa fa-star-half-alt"/>}
            fullIcon={<i className="fa fa-star"/>}
            activeColor={user?.rating <= 2 ? "#ff0000" : "#ffd700"}
        />
    </>)
}
export default Raiting;
