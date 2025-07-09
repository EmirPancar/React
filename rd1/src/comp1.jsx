import React from "react";

function Cmp1(props){

    return(

        <div> 
            <table border="4px">
                <thead>
                        <tr>
                            <th>Ürün</th>
                            <th>Fiyat</th>

                        </tr>

                </thead>

                <tbody>
                        {props.urunler.map((urun,index) => 

                            <tr key={index}>
                                <td data-label="Ürün">{urun.cesit}</td>
                                <td data-label="Fiyat">{urun.fiyat}</td>
                            </tr>
                        
                        )}
                        

                </tbody>

            </table>

        </div>

    );

}

export default Cmp1;